import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendContactNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, platform, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Save to database via Prisma
    const submission = await db.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        service: service && service !== "Choose a service" ? service : null,
        platform: platform && platform !== "Choose a platform" ? platform : null,
        message,
      },
    });

    console.log("Contact form submission saved:", submission.id, {
      name,
      email,
      timestamp: submission.createdAt,
    });

    // Send email notification (fire-and-forget, non-blocking)
    sendContactNotification({ name, email, phone, service, platform, message }).catch(
      (err) => console.error("[Contact] Email notification failed:", err)
    );

    return NextResponse.json({
      success: true,
      message: "Thank you! We'll get back to you soon.",
      id: submission.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}
