import { load } from 'cheerio';
import original from '@/content/original-home.json';

const origin = 'https://lemarkllc.ru';
const snapshot = load(original.html);
const forms = snapshot('form.ajax_form').toArray().map(el => ({
  id: snapshot(el).attr('id'),
  token: snapshot(el).find('[name=af_action]').val(),
}));
const error = (message: string) => Response.json({ success: false, message }, { headers: {'Cache-Control':'no-store'} });

export async function POST(request: Request) {
  const source = request.headers.get('origin');
  // Netlify's adapter may use an internal request origin. Accept only this
  // project's verified public origins, never an arbitrary forwarded host.
  const allowedOrigins = new Set([new URL(request.url).origin, 'https://lemarknewlend.netlify.app', origin]);
  const ownPreview = source && /^https:\/\/[a-z0-9-]+--lemarknewlend\.netlify\.app$/.test(source);
  if (source && !allowedOrigins.has(source) && !ownPreview) return new Response('Forbidden', {status:403});
  if (Number(request.headers.get('content-length') || 0) > 10_000_000) return error('Максимальный размер вложений — 10 МБ.');
  try {
    const bytes = await request.arrayBuffer();
    if (bytes.byteLength > 10_000_000) return error('Максимальный размер вложений — 10 МБ.');
    const data = await new Request(request.url, {method:'POST',headers:{'Content-Type':request.headers.get('content-type') || ''},body:bytes}).formData();
    const form = forms.find(form => form.token === data.get('af_action'));
    if (!form) return error('Форма устарела. Обновите страницу или свяжитесь с нами через lemarkllc.ru.');
    // MODX stores AjaxForm configuration in its PHP session. Establish a fresh
    // original session for this submission, without exposing its cookies to JS.
    const home = await fetch(origin + '/', {cache:'no-store',signal:AbortSignal.timeout(15000)});
    if (!home.ok) throw new Error('Original website unavailable');
    const current = load(await home.text());
    const token = current(form.id ? `form[id="${form.id}"] [name=af_action]` : '.gbp-form [name=af_action]').val();
    if (typeof token !== 'string') throw new Error('Original form missing');
    data.set('af_action', token);
    data.set('pageId','1');
    const cookie = home.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
    const upstream = await fetch(origin + '/assets/components/ajaxform/action.php', {
      method:'POST',body:data,headers:{Cookie:cookie,Origin:origin,Referer:origin + '/','X-Requested-With':'XMLHttpRequest'},
      cache:'no-store',signal:AbortSignal.timeout(20000),
    });
    if (!upstream.ok) throw new Error('Original handler unavailable');
    const result = await upstream.json();
    return Response.json(result, {headers:{'Cache-Control':'no-store'}});
  } catch {
    return error('Не удалось связаться с сервером. Повторите попытку или позвоните по номеру на сайте.');
  }
}
