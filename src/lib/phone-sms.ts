import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

function formatBdPhone(phone: string): string | null {
  const cleaned = phone.replace(/\D/g, "");

  // 1712345678
  if (/^1[3-9]\d{8}$/.test(cleaned)) {
    return `+880${cleaned}`;
  }

  // 01712345678
  if (/^01[3-9]\d{8}$/.test(cleaned)) {
    return `+88${cleaned}`;
  }

  // 8801712345678
  if (/^8801[3-9]\d{8}$/.test(cleaned)) {
    return `+${cleaned}`;
  }

  return null;
}

export async function sendSms(body: string, phone: string) {
  const formattedPhone = formatBdPhone(phone);
  if (!formattedPhone) {
    throw new Error("Invalid Bangladeshi phone number");
  }
 
  const msg = await client.messages.create({
    body: body,
    from: process.env.TWILIO_FROM,
    to: `+88${phone}`,
  });

  console.log(msg.sid);
}
