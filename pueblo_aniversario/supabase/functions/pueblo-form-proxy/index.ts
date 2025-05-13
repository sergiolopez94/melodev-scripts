// supabase/functions/pueblo-form-proxy/index.ts

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }
  
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405,
      headers: CORS_HEADERS
    });
  }

  try {
    const apiKey = Deno.env.get("N8N_API_KEY");
    if (!apiKey) {
      return new Response("Missing API key", { 
        status: 500,
        headers: CORS_HEADERS
      });
    }

    // Parse the form data from the client
    const formData = await req.formData();
    
    // Convert FormData to a plain object for n8n
    const formObject: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      // Ensure we're only dealing with string values
      formObject[key] = value.toString();
    }
    
    // Get client headers (excluding some that cause issues)
    const headersToExclude = ['host', 'content-length'];
    const clientHeaders: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      if (!headersToExclude.includes(key.toLowerCase())) {
        clientHeaders[key] = value;
      }
    });
    
    // Add custom headers for n8n
    clientHeaders['content-type'] = 'application/json';
    clientHeaders['api-key'] = apiKey;
    
    // Create the payload in the format n8n expects
    const n8nPayload = {
      headers: clientHeaders,
      params: {},
      query: {},
      body: formObject,
      webhookUrl: "https://n8n.melodev.com/webhook/pueblo-aniversario-form",
      executionMode: "production"
    };
    
    console.log("Sending to n8n:", JSON.stringify([n8nPayload]));
    
    // Send the payload to n8n
    const n8nResponse = await fetch("https://n8n.melodev.com/webhook/pueblo-aniversario-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify([n8nPayload]) // Wrap in array as shown in your example
    });
    
    // Return n8n's response to the client
    const responseText = await n8nResponse.text();
    const responseContentType = n8nResponse.headers.get("Content-Type") || "application/json";
    
    console.log("Response from n8n:", responseText);
    
    return new Response(responseText, {
      status: n8nResponse.status,
      headers: {
        "Content-Type": responseContentType,
        ...CORS_HEADERS
      }
    });
  } catch (err) {
    console.error("Error forwarding form to n8n:", err);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...CORS_HEADERS
      }
    });
  }
});