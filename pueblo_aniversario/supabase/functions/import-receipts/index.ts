import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import Papa from "https://esm.sh/papaparse";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const rawCsv = await req.text();

    const { data, errors } = Papa.parse(rawCsv, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length > 0) {
      return new Response(JSON.stringify({ status: "error", errors }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    const BATCH_SIZE = 500;
    let totalInserted = 0;

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE).map((row: any) => ({
        receipt: row.receipt,
        number_of_products: parseInt(row.number_of_products, 10),
        purchase_date: row.purchase_date,
      }));

      const { error } = await supabase
        .from("qualifying_receipts")
        .insert(batch);

      if (error) {
        return new Response(
          JSON.stringify({
            status: "error",
            message: error.message,
            batchStart: i,
            batchSize: batch.length,
          }),
          { status: 500, headers: CORS_HEADERS }
        );
      }

      totalInserted += batch.length;
    }

    return new Response(
      JSON.stringify({
        status: "ok",
        inserted: totalInserted,
        message: "Data inserted in batches",
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "error", message: err.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
});
