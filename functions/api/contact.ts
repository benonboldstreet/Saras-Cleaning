interface Env {
  // Cloudflare environment variables set in the Pages Dashboard
  RESEND_API_KEY?: string;
  TO_EMAIL?: string;
  CONTACT_WEBHOOK_URL?: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const { request, env } = context;
    const body: any = await request.json();

    const name = body.name || "";
    const email = body.email || "";
    const phone = body.phone || "";
    const company = body.company || "";
    const service = body.service || body.serviceType || "General Routine Cleaning";
    const message = body.message || "";

    // 1. Send via Resend (highly recommended for seamless email forwarding on Cloudflare)
    let emailSent = false;
    let resendMessage = "";
    
    if (env.RESEND_API_KEY) {
      const recipient = env.TO_EMAIL || "sara.louise.calvert@gmail.com";
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Sara Louise Facilities <onboarding@resend.dev>", // Or verified domain
          to: [recipient],
          reply_to: email || undefined,
          subject: `📧 New Cleaning Inquiry from ${name}`,
          html: `
            <h2>New Booking / Inquiry Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email || "Not provided"}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Company:</strong> ${company || "Not provided"}</p>
            <p><strong>Service Requested:</strong> ${service}</p>
            <p><strong>Message / Location & Prep details:</strong></p>
            <blockquote style="background: #f1f5f9; padding: 12px; border-left: 4px solid #d97706; margin: 10px 0;">
              ${message.replace(/\n/g, "<br>")}
            </blockquote>
            <p style="font-size: 11px; color: #64748b; margin-top: 30px;">Submitted from Sara Louise Facilities website on ${new Date().toLocaleString()}</p>
          `
        })
      });

      if (resendResponse.ok) {
        emailSent = true;
        resendMessage = "Inquiry emailed to owner successfully via Resend.";
      } else {
        const errText = await resendResponse.text();
        resendMessage = `Resend attempt failed: ${errText}`;
        console.error(resendMessage);
      }
    }

    // 2. Forward to Webhook if provided (e.g., Discord channel, Slack, Make.com, or Zapier)
    let webhookSent = false;
    if (env.CONTACT_WEBHOOK_URL) {
      const webhookRes = await fetch(env.CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: `✨ New Cleaning Inquiry: ${name}`,
              color: 0xD97706, // Amber
              fields: [
                { name: "Name", value: name || "N/A", inline: true },
                { name: "Email", value: email || "N/A", inline: true },
                { name: "Phone", value: phone || "N/A", inline: true },
                { name: "Company", value: company || "N/A", inline: true },
                { name: "Service", value: service || "N/A", inline: true },
                { name: "Inquiry Message", value: message || "No message detailed." }
              ],
              timestamp: new Date().toISOString()
            }
          ]
        })
      });
      if (webhookRes.ok) webhookSent = true;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Thank you for contacting Sara Louise Facilities. Your inquiry has been received!",
        details: {
          emailSent,
          webhookSent,
          resendInfo: resendMessage || "Resend not configured"
        }
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to process the submission."
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
};

// Handle OPTIONS preflight request for CORS if needed
export const onRequestOptions = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};
