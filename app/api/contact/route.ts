import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, projectType, message } = body;

    if (!name || !email || !phone || !projectType || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload = {
      name,
      email,
      phone,
      projectType,
      message,
      receivedAt: new Date().toISOString(),
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
          subject: `Nueva consulta: ${name} — ${projectType}`,
          html: `
            <h2>Nueva consulta desde la web</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${phone}</p>
            <p><strong>Tipo de proyecto:</strong> ${projectType}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message}</p>
          `,
        }),
      });
    } else {
      console.log("[Contact form submission]", payload);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
