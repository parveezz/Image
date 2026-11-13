import { generatePublicPageMetadata, renderPublicPage } from "@/shared/publicPageHelper";

export async function generateMetadata() {
  return await generatePublicPageMetadata("appeals");
}

export default async function AppealsPage() {
  return await renderPublicPage("appeals");
}
