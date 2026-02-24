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

  const stsClient = new STSClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const command = new AssumeRoleCommand({
    RoleArn: process.env.IAM_ROLE_ARN,
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

// Obtener información básica de productos
async function getProductsInfo(headers, asins) {
  const results = [];

  for (const asin of asins) {
    // Verificar caché
    const cacheKey = `product_${asin}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      results.push(cached.data);
      continue;
    }

    try {
      // Nota: Esta es una implementación básica
      // El SDK amazon-sp-api 1.2.0 tiene limitaciones con endpoints específicos
      // En producción, podrías necesitar hacer llamadas HTTP directas a SP-API

      const productData = {
        asin: asin,
        status: "cached",
        message: "Use getPrices action for real-time data",
        // Aquí irían los datos reales del producto
        // Por ahora retornamos estructura básica
      };

      cache.set(cacheKey, {
        data: productData,
        timestamp: Date.now(),
      });

      results.push(productData);

      // Rate limiting: 1 request/seg
      if (asins.indexOf(asin) < asins.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1100));
      }
    } catch (error) {
      results.push({
        asin: asin,
        error: error.message,
        code: error.code,
      });
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      products: results,
      timestamp: new Date().toISOString(),
      mode: process.env.USE_SPAPI_SANDBOX === "true" ? "sandbox" : "production",
    }),
  };
}

// Obtener precios de productos (implementación futura)
async function getProductPrices(headers, asins) {
  // Esta función se implementará con llamadas reales a SP-API
  // una vez que identifiquemos el endpoint correcto para el SDK 1.2.0

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      message: "Price fetching to be implemented",
      asins: asins,
      note: "This will be connected to real SP-API pricing endpoint",
    }),
  };
}
