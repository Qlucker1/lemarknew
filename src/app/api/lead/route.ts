import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(200),
  phone: z.string().trim().min(7).max(60),
  email: z.string().trim().email().max(200),
  direction: z.string().trim().min(1).max(120),
  volume: z.string().trim().max(200).optional(),
  comment: z.string().trim().max(2000).optional(),
  consent: z.literal("true"),
  samples: z.enum(["true", "false"]).optional(),
  website: z.string().max(0).optional(),
});

const allowedExtensions = new Set(["pdf", "dwg", "dxf", "doc", "docx", "xls", "xlsx", "jpg", "jpeg", "png", "zip"]);
const rateLimit = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const bucket = rateLimit.get(ip);
  if (bucket && bucket.resetAt > now && bucket.count >= 5) return NextResponse.json({ message: "Слишком много попыток. Попробуйте через несколько минут" }, { status: 429 });
  rateLimit.set(ip, bucket && bucket.resetAt > now ? { ...bucket, count: bucket.count + 1 } : { count: 1, resetAt: now + 10 * 60_000 });

  const formData = await request.formData();
  const values = Object.fromEntries(Array.from(formData.entries()).filter(([, value]) => typeof value === "string"));
  const parsed = leadSchema.safeParse(values);
  if (!parsed.success) return NextResponse.json({ message: "Проверьте обязательные поля формы" }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ message: "Запрос отклонён" }, { status: 400 });

  const attachment = formData.get("attachment");
  if (attachment instanceof File && attachment.size) {
    const extension = attachment.name.split(".").pop()?.toLowerCase() ?? "";
    if (!allowedExtensions.has(extension) || attachment.size > 10 * 1024 * 1024) return NextResponse.json({ message: "Недопустимый формат или размер файла" }, { status: 400 });
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) return NextResponse.json({ message: "Онлайн-отправка пока не настроена" }, { status: 503 });

  const outbound = new FormData();
  Object.entries(parsed.data).forEach(([key, value]) => outbound.append(key, String(value ?? "")));
  if (process.env.LEAD_EMAIL_TO) outbound.append("email_to", process.env.LEAD_EMAIL_TO);
  outbound.append("source", "lemark-cinematic-landing");
  if (attachment instanceof File && attachment.size) outbound.append("attachment", attachment, attachment.name);

  try {
    const response = await fetch(webhook, { method: "POST", body: outbound, signal: AbortSignal.timeout(15_000) });
    if (!response.ok) return NextResponse.json({ message: "Сервис приёма заявок временно недоступен" }, { status: 502 });
    return NextResponse.json({ message: "Заявка отправлена. Менеджер свяжется с вами." });
  } catch {
    return NextResponse.json({ message: "Не удалось связаться с сервисом приёма заявок" }, { status: 502 });
  }
}
