import { Resend } from "resend";

const TO = "shoobydoofruitsnacks@gmail.com";
const CC = "nguyen.william0121@gmail.com";
const FROM = "Shooby <shooby@cloverfield.studio>";

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const str = (key: string) =>
    typeof payload[key] === "string" ? (payload[key] as string).trim() : "";

  const name = str("name");
  const email = str("email");
  const eventType = str("eventType");
  const date = str("date");
  const artist = str("artist");
  const message = str("message");

  if (!name || !email || !message) {
    return Response.json(
      { error: "Name, email and message are required" },
      { status: 400 }
    );
  }

  const text = [
    message,
    "",
    "Booking details",
    eventType && `Event type: ${eventType}`,
    date && `Date: ${date}`,
    artist && `Artist / act: ${artist}`,
    "",
    `From: ${name}`,
    `Reply to: ${email}`,
  ]
    .filter(Boolean)
    .join("\n");

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: FROM,
    to: TO,
    cc: CC,
    replyTo: email,
    subject: `Enquiry from ${name}`,
    text,
  });

  if (error) {
    console.error("Resend error:", error);
    return Response.json({ error: "Failed to send" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
