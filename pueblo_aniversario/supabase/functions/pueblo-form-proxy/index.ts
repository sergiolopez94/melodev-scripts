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
    
    // Forward the raw body to n8n (for multipart/form-data)
    const body = req.body;
    const n8nResponse = await fetch("https://n8n.melodev.com/webhook/pueblo-aniversario-form", {
      method: "POST",
      headers: {
        "api-key": apiKey,
      },
      body,
    });
    
    const contentType = n8nResponse.headers.get("content-type") || "text/plain";
    const responseText = await n8nResponse.text();
    
    return new Response(responseText, {
      status: n8nResponse.status,
      headers: {
        "Content-Type": contentType,
        ...CORS_HEADERS
      },
    });
  } catch (err) {
    console.error("Error forwarding form to n8n:", err);
    return new Response("Internal Server Error", { 
      status: 500,
      headers: CORS_HEADERS
    });
  }
});