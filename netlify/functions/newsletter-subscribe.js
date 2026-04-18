// netlify/functions/newsletter-subscribe.js
// Handles newsletter sign-up submissions from the site footer form.

exports.handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://blissedskin.us",
    "Content-Type": "application/json",
  };

  // Only accept POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Parse body
  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Invalid request body" }),
    };
  }

  const { name, email } = body;
  const botField = body["bot-field"];

  // ── Honeypot check ──────────────────────────────────────────────────────────
  // If the hidden bot-field is filled, silently discard (don't reveal to bots)
  if (botField) {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true }),
    };
  }

  // ── Input validation ────────────────────────────────────────────────────────
  if (!name || !email) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Name and email are required" }),
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[A-Za-z\u00C0-\u00FF\s']{1,100}$/;

  if (!emailRegex.test(email)) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Invalid email format" }),
    };
  }

  if (!nameRegex.test(name)) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Invalid name format" }),
    };
  }

  // ── Sanitize (no XSS in logs, enforce length limits) ───────────────────────
  const safeEmail = email.toLowerCase().trim().slice(0, 254);
  const safeName = name.trim().slice(0, 100);

  // ── ESP Integration Point ───────────────────────────────────────────────────
  // Replace this section to connect to your Email Service Provider.
  //
  // Example: Klaviyo
  // const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY;
  // const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID;
  // await fetch(`https://a.klaviyo.com/api/v2/list/${KLAVIYO_LIST_ID}/members`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Api-Key": KLAVIYO_API_KEY,
  //   },
  //   body: JSON.stringify({ profiles: [{ email: safeEmail, first_name: safeName }] }),
  // });
  //
  // Example: Mailchimp (via mailchimp-marketing SDK)
  // const mailchimp = require("@mailchimp/mailchimp_marketing");
  // mailchimp.setConfig({ apiKey: process.env.MAILCHIMP_API_KEY, server: "us1" });
  // await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
  //   email_address: safeEmail,
  //   status: "subscribed",
  //   merge_fields: { FNAME: safeName },
  // });
  // ───────────────────────────────────────────────────────────────────────────

  // For now: log subscription (visible in Netlify → Functions → Logs)
  console.log(
    `[Newsletter] New subscriber: ${safeName} <${safeEmail}> — ${new Date().toISOString()}`
  );

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      message: "Successfully subscribed to Blissed Skin newsletter",
    }),
  };
};
