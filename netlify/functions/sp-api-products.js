// netlify/functions/sp-api-products.js
// Netlify Function para exponer Amazon SP-API de forma segura

const SellingPartner = require("amazon-sp-api");
const { STSClient, AssumeRoleCommand } = require("@aws-sdk/client-sts");

// Caché simple en memoria (resetea cada cold start)
const cache = new Map();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutos

// Helper para obtener credenciales temporales de AWS STS
async function getTemporaryCredentials() {
  const cacheKey = "sts_credentials";
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < 50 * 60 * 1000) {
    // 50 min (expiran en 60)
    return cached.data;
  }

  // SPAPI_AWS_* evita conflicto con las vars AWS_ que Netlify inyecta internamente
  const stsClient = new STSClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.SPAPI_AWS_KEY,
      secretAccessKey: process.env.SPAPI_AWS_SECRET,
    },
  });

  const command = new AssumeRoleCommand({
    RoleArn: process.env.SPAPI_ROLE_ARN,
    RoleSessionName: "netlify-sp-api-session",
    DurationSeconds: 3600,
  });

  const response = await stsClient.send(command);

  cache.set(cacheKey, {
    data: response.Credentials,
    timestamp: Date.now(),
  });

  return response.Credentials;
}

// Helper para inicializar cliente SP-API
async function getSPClient() {
  const credentials = await getTemporaryCredentials();

  const useSandbox = process.env.USE_SPAPI_SANDBOX === "true";

  return new SellingPartner({
    region: "na", // North America
    refresh_token: process.env.REFRESH_TOKEN,
    credentials: {
      SELLING_PARTNER_APP_CLIENT_ID: process.env.LWA_CLIENT_ID,
      SELLING_PARTNER_APP_CLIENT_SECRET: process.env.LWA_CLIENT_SECRET,
      AWS_ACCESS_KEY_ID: credentials.AccessKeyId,
      AWS_SECRET_ACCESS_KEY: credentials.SecretAccessKey,
      AWS_SESSION_TOKEN: credentials.SessionToken,
    },
    options: {
      use_sandbox: useSandbox,
      debug_log: false,
    },
  });
}

// Handler principal
exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Manejar preflight request
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    // Parse query params
    const params = event.queryStringParameters || {};
    const action = params.action || "health";

    // Health check
    if (action === "health") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: "ok",
          message: "SP-API Netlify Function is running",
          mode: process.env.USE_SPAPI_SANDBOX === "true" ? "sandbox" : "production",
          timestamp: new Date().toISOString(),
        }),
      };
    }

    // Debug: verificar env vars (enmascaradas) — remover después de diagnóstico
    if (action === "debug") {
      const mask = (v) => (v ? `${v.slice(0, 4)}...${v.slice(-4)} (len:${v.length})` : "NOT SET");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          SPAPI_AWS_KEY: mask(process.env.SPAPI_AWS_KEY),
          SPAPI_AWS_SECRET: mask(process.env.SPAPI_AWS_SECRET),
          SPAPI_ROLE_ARN: mask(process.env.SPAPI_ROLE_ARN),
          LWA_CLIENT_ID: mask(process.env.LWA_CLIENT_ID),
          REFRESH_TOKEN: mask(process.env.REFRESH_TOKEN),
          MARKETPLACE_ID: process.env.MARKETPLACE_ID || "NOT SET",
          USE_SPAPI_SANDBOX: process.env.USE_SPAPI_SANDBOX || "NOT SET",
          // Netlify internal (should NOT be AKIA):
          NETLIFY_AWS_KEY_prefix: process.env.AWS_ACCESS_KEY_ID
            ? process.env.AWS_ACCESS_KEY_ID.slice(0, 4)
            : "NOT SET",
        }),
      };
    }

    // Obtener ASINs desde query param
    const asins = params.asins ? params.asins.split(",") : [];

    if (asins.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Missing required parameter: asins",
          example: "?action=getProducts&asins=B07ZPKBL9V,B08XYZ123",
        }),
      };
    }

    // Switch según acción
    switch (action) {
      case "getProducts":
        return await getProductsInfo(headers, asins);

      case "getPrices":
        return await getProductPrices(headers, asins);

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: "Invalid action",
            available: ["health", "getProducts", "getPrices"],
          }),
        };
    }
  } catch (error) {
    console.error("SP-API Error:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message,
        code: error.code || "UNKNOWN_ERROR",
        details: error.response?.data || "No additional details",
      }),
    };
  }
};

// Obtener datos completos de productos: título, imágenes, precio, stock
async function getProductsInfo(headers, asins) {
  const results = [];
  const spClient = await getSPClient();

  for (const asin of asins) {
    const cacheKey = `product_${asin}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      results.push(cached.data);
      continue;
    }

    try {
      // Llamadas paralelas: Catalog Items + Product Pricing
      const [catalogRes, pricingRes] = await Promise.all([
        spClient.callAPI({
          operation: "getCatalogItem",
          endpoint: "catalogItems",
          path: { asin },
          query: {
            marketplaceIds: [process.env.MARKETPLACE_ID],
            includedData: ["summaries", "images", "attributes"],
          },
        }),
        spClient.callAPI({
          operation: "getItemOffers",
          endpoint: "productPricing",
          path: { Asin: asin },
          query: {
            MarketplaceId: process.env.MARKETPLACE_ID,
            ItemCondition: "New",
          },
        }),
      ]);

      // --- Catalog: título, marca, descripción, imágenes ---
      const summary =
        catalogRes?.summaries?.find((s) => s.marketplaceId === process.env.MARKETPLACE_ID) ||
        catalogRes?.summaries?.[0] ||
        {};

      const marketplaceImages =
        catalogRes?.images?.find((i) => i.marketplaceId === process.env.MARKETPLACE_ID)?.images ||
        catalogRes?.images?.[0]?.images ||
        [];

      const mainImage = marketplaceImages.find((img) => img.variant === "MAIN");
      const galleryImages = marketplaceImages
        .filter((img) => img.variant !== "MAIN" && img.variant !== "SWCH")
        .slice(0, 4)
        .map((img) => img.link);

      // Descripción desde attributes
      const bulletPoints = catalogRes?.attributes?.bullet_point?.map((b) => b.value) || [];

      // --- Pricing: precio actual, precio de lista, Buy Box, stock ---
      const pricingPayload = pricingRes?.payload || pricingRes || {};
      const summary_pricing = pricingPayload?.Summary || {};

      const buyBox =
        summary_pricing?.BuyBoxPrices?.find((b) => b.condition?.toLowerCase() === "new") ||
        summary_pricing?.BuyBoxPrices?.[0];

      const lowestNew =
        summary_pricing?.LowestPrices?.find(
          (p) => p.condition?.toLowerCase() === "new" && p.fulfillmentChannel === "Amazon"
        ) || summary_pricing?.LowestPrices?.[0];

      const currentPrice =
        buyBox?.LandedPrice?.Amount ||
        buyBox?.ListingPrice?.Amount ||
        lowestNew?.LandedPrice?.Amount ||
        null;

      const listPrice = summary_pricing?.ListPrice?.Amount || null;

      const currency =
        buyBox?.LandedPrice?.CurrencyCode || lowestNew?.LandedPrice?.CurrencyCode || "USD";

      const savings =
        listPrice && currentPrice && listPrice > currentPrice
          ? parseFloat((listPrice - currentPrice).toFixed(2))
          : null;

      const savingsPct = savings && listPrice ? Math.round((savings / listPrice) * 100) : null;

      const totalOffers = summary_pricing?.TotalOfferCount || 0;

      const productData = {
        asin,
        // Catálogo
        title: summary?.itemName || null,
        brand: summary?.brand || null,
        bulletPoints,
        images: {
          main: mainImage?.link || null,
          gallery: galleryImages,
        },
        // Precios
        pricing: {
          current: currentPrice,
          list: listPrice,
          currency,
          savings,
          savingsPct,
          hasBuyBox: !!buyBox,
        },
        // Stock
        availability: {
          inStock: totalOffers > 0,
          totalOffers,
          fulfillment: buyBox?.fulfillmentChannel || lowestNew?.fulfillmentChannel || null,
          isPrime: buyBox?.fulfillmentChannel === "Amazon",
        },
        source: "sp-api",
        fetchedAt: new Date().toISOString(),
      };

      cache.set(cacheKey, { data: productData, timestamp: Date.now() });
      results.push(productData);

      // Rate limiting entre ASINs: SP-API permite ~1 req/seg en Catalog
      if (asins.indexOf(asin) < asins.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
    } catch (error) {
      console.error(`[getProducts] Error ASIN ${asin}:`, error.message);
      results.push({
        asin,
        error: error.message,
        code: error.code || "SP_API_ERROR",
        details: error.response?.data || null,
      });
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      products: results,
      count: results.length,
      timestamp: new Date().toISOString(),
      mode: process.env.USE_SPAPI_SANDBOX === "true" ? "sandbox" : "production",
    }),
  };
}

// Obtener solo precios (caché corta: 5 min — precios cambian frecuente)
const PRICE_CACHE_DURATION = 5 * 60 * 1000;

async function getProductPrices(headers, asins) {
  const results = [];
  const spClient = await getSPClient();

  for (const asin of asins) {
    const cacheKey = `price_${asin}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < PRICE_CACHE_DURATION) {
      results.push(cached.data);
      continue;
    }

    try {
      const pricingRes = await spClient.callAPI({
        operation: "getItemOffers",
        endpoint: "productPricing",
        path: { Asin: asin },
        query: {
          MarketplaceId: process.env.MARKETPLACE_ID,
          ItemCondition: "New",
        },
      });

      const pricingPayload = pricingRes?.payload || pricingRes || {};
      const summary = pricingPayload?.Summary || {};

      const buyBox =
        summary?.BuyBoxPrices?.find((b) => b.condition?.toLowerCase() === "new") ||
        summary?.BuyBoxPrices?.[0];

      const currentPrice = buyBox?.LandedPrice?.Amount || buyBox?.ListingPrice?.Amount || null;

      const listPrice = summary?.ListPrice?.Amount || null;
      const currency = buyBox?.LandedPrice?.CurrencyCode || "USD";

      const priceData = {
        asin,
        current: currentPrice,
        list: listPrice,
        currency,
        savings:
          listPrice && currentPrice && listPrice > currentPrice
            ? parseFloat((listPrice - currentPrice).toFixed(2))
            : null,
        savingsPct:
          listPrice && currentPrice && listPrice > currentPrice
            ? Math.round(((listPrice - currentPrice) / listPrice) * 100)
            : null,
        inStock: (summary?.TotalOfferCount || 0) > 0,
        isPrime: buyBox?.fulfillmentChannel === "Amazon",
        fetchedAt: new Date().toISOString(),
      };

      cache.set(cacheKey, { data: priceData, timestamp: Date.now() });
      results.push(priceData);

      if (asins.indexOf(asin) < asins.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`[getPrices] Error ASIN ${asin}:`, error.message);
      results.push({
        asin,
        error: error.message,
        code: error.code || "SP_API_ERROR",
      });
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      prices: results,
      count: results.length,
      timestamp: new Date().toISOString(),
      mode: process.env.USE_SPAPI_SANDBOX === "true" ? "sandbox" : "production",
    }),
  };
}
