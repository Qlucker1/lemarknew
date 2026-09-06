import original from '@/content/original-home.json';
import { heroHtml } from '@/hero/markup';

export const dynamic = 'force-static';

// Preserve the official site's HTML/CSS/runtime outside the one replaced intro.
export function GET() {
  return new Response(original.html.replace('<!--LEMARK_HERO-->', heroHtml), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
