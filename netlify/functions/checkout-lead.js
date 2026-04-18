// netlify/functions/checkout-lead.js
// Appends checkout lead data (customer info + cart) to a Google Sheet.
//
// Required env vars in Netlify:
//   GOOGLE_SERVICE_ACCOUNT_EMAIL  — e.g. my-sa@project.iam.gserviceaccount.com
//   GOOGLE_PRIVATE_KEY            — full PEM key (Netlify preserves \n in env vars)
//   GOOGLE_SHEET_ID               — the long ID from the Google Sheets URL

const { google } = require("googleapis");

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://blissedskin.us",
  "Content-Type": "application/json",
};

exports.handler = async (event) => {
  // Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // ── Parse & validate body ────────────────────────────────────────────────
  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Invalid request body" }),
    };
  }

  const { email, fullName, phone, cart } = body;

  if (!email || !fullName) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "email and fullName are required" }),
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Invalid email format" }),
    };
  }

  // Sanitize
  const safeEmail = email.toLowerCase().trim().slice(0, 254);
  const safeName = fullName.trim().slice(0, 100);
  const safePhone = (phone || "").trim().slice(0, 30);

  // Summarize cart
  const cartSummary = Array.isArray(cart)
    ? cart.map((i) => `${i.item_name} x${i.quantity}`).join(" | ")
    : "";
  const cartTotal = Array.isArray(cart)
    ? cart.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
    : "0.00";

  const timestamp = new Date().toISOString();

  // ── Google Sheets auth ───────────────────────────────────────────────────
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!privateKey || !clientEmail || !sheetId) {
    console.error("[checkout-lead] Missing Google Sheets env vars");
    // Don't block the purchase — log and return success
    console.log(`[checkout-lead] Lead NOT saved: ${safeName} <${safeEmail}>`);
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: true, warning: "Sheet not configured" }),
    };
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Append one row: Timestamp | Name | Email | Phone | Cart | Total ($)
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Leads!A:F",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[timestamp, safeName, safeEmail, safePhone, cartSummary, `$${cartTotal}`]],
      },
    });

    console.log(`[checkout-lead] Saved: ${safeName} <${safeEmail}> — $${cartTotal}`);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    // Log but don't block the purchase flow
    console.error("[checkout-lead] Sheets error:", err.message);
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: true, warning: "Lead logging failed" }),
    };
  }
};
