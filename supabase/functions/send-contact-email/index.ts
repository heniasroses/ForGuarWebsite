Deno.serve(async (req) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  // Handle preflight request (IMPORTANT)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers,
      });
    }

    const { firstName, lastName, email, message } = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing RESEND_API_KEY" }),
        { status: 500, headers }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Forest Guardians <onboarding@resend.dev>",
        to: "heniasroses@gmail.com",
        subject: "New Contact Form Message",
        html: `
          <h2>New Message</h2>
          <p><b>Name:</b> ${firstName} ${lastName}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Message:</b> ${message}</p>
        `,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers,
    });
  }
});