import { db } from "@/lib/db";
import { NextResponse } from "next/server";

function markdownToHtml(md: string): string {
  if (!md) return "";

  // 1. Escape HTML entities first (safety)
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. Block elements — headings
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // 3. Inline — custom [color:#hex]...[/color]
  html = html.replace(
    /\[color:(#?[a-zA-Z0-9]+)\]([\s\S]*?)\[\/color\]/g,
    '<span style="color:$1">$2</span>',
  );

  // 4. Inline — custom [size:N]...[/size]  (N in px or em, e.g. 24px, 1.5em)
  html = html.replace(
    /\[size:([0-9.]+(?:px|em|rem|%))\]([\s\S]*?)\[\/size\]/g,
    '<span style="font-size:$1">$2</span>',
  );

  // 5. Inline — **bold**
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // 6. Inline — *italic*
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // 7. Inline — ~~strikethrough~~
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // 8. Inline — `code`
  html = html.replace(/`(.+?)`/g, "<code>$1</code>");

  // 9. Paragraphs — wrap blocks of text not already wrapped in a tag
  html = html
    .split(/\n{2,}/)
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      if (/^<(h[1-3]|ul|ol|li|blockquote|pre|div)/.test(block)) return block;
      return `<p>${block.replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");

  return html;
}

// ── GET /api/site-text ────────────────────────────────────────────────────────
export async function GET() {
  try {
    console.log("called")
    const record = await db.siteTextContent.findUnique({
      where: { id: "singleton" },
    });

    const raw = record?.headLine ?? "";
    const html = markdownToHtml(raw);

    return NextResponse.json({ raw, html });
  } catch (err) {
    console.error("[site-text GET]", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
