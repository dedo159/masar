import { cookies } from "next/headers";
import { Language, translations, TranslationSchema } from "./index";

export async function getServerTranslations(): Promise<TranslationSchema> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value as Language;
  
  if (locale === "en" || locale === "ar") {
    return translations[locale];
  }
  
  return translations.ar;
}