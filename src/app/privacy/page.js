import { generatePublicPageMetadata, renderPublicPage } from "@/shared/publicPageHelper";

export async function generateMetadata() {
  return await generatePublicPageMetadata("privacy");
}

export default async function PrivacyPage() {
  return await renderPublicPage("privacy");
}
