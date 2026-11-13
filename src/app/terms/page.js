import { generatePublicPageMetadata, renderPublicPage } from "@/shared/publicPageHelper";

export async function generateMetadata() {
  return await generatePublicPageMetadata("terms");
}

export default async function TermsPage() {
  return await renderPublicPage("terms");
}
