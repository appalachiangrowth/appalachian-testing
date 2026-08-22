import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendContactNotification } from "@/lib/email";

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = readString(body?.name);
    const email = readString(body?.email);
    const phone = readString(body?.phone);
    const service = readString(body?.service);
    const platform = readString(body?.platform);
    const message = readString(body?.message);

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (name.length > 120 || email.length > 320 || phone.length > 40 || message.length > 5000) {
      return NextResponse.json(
        { success: false, error: "One or more fields are too long." },
        { status: 400 }
      );
    }

    const contactData = {
      name,
      email,
      phone: phone || null,
      service: service && service !== "Choose a service" ? service : null,
      platform: platform && platform !== "Choose a platform" ? platform : null,
      message,
    };

    // Deliver the email before reporting success. This keeps the form useful even
    // when the optional database is not configured in a local or preview environment.
    const emailSent = await sendContactNotification(contactData);
    if (!emailSent) {
      return NextResponse.json(
        { success: false, error: "Email delivery is not configured. Please try again later." },
        { status: 503 }
      );
    }

    let submissionId: string | null = null;
    try {
      const submission = await db.contactSubmission.create({ data: contactData });
      submissionId = submission.id;
      console.log("Contact form submission saved:", submission.id);
    } catch (databaseError) {
      // Email delivery is the primary requirement; do not discard a successfully
      // delivered lead just because the optional persistence database is unavailable.
      console.warn("[Contact] Database persistence skipped:", databaseError);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! We'll get back to you soon.",
      id: submissionId,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}
