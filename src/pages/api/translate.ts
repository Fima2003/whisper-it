export const prerender = false;
import { Translate } from "@google-cloud/translate/build/src/v2";

const translate = new Translate();

export async function GET({ request }: any): Promise<Response> {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const text = params.get("text");
  const from = params.get("from");
  const to = params.get("to") ?? "en";
  if (!text || !from)
    throw new Error("Could not translate. Provide text and from");
  const [translations] = await translate.translate(text, to);
  const actualTranslations = Array.isArray(translations)
    ? translations
    : [translations];
  return Response.json({ translations: actualTranslations });
}
