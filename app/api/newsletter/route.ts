import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const payload = {
      email,
      subscribedAt: new Date().toISOString(),
    };

    if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "onboarding@resend.dev",
          to: process.env.CONTACT_EMAIL,
          subject: `Nueva suscripción newsletter: ${email}`,
          html: `<p>Nuevo suscriptor: <strong>${email}</strong></p>`,
        }),
      });
    } else {
      console.log("[Newsletter subscription]", payload);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
