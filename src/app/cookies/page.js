import { generatePublicPageMetadata, renderPublicPage } from "@/shared/publicPageHelper";

export async function generateMetadata() {
  return await generatePublicPageMetadata("cookies");
}

export default async function CookiesPage() {
  return await renderPublicPage("cookies");
}
