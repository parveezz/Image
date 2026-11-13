import { generatePublicPageMetadata, renderPublicPage } from "@/shared/publicPageHelper";

export async function generateMetadata() {
  return await generatePublicPageMetadata("copyright");
}

export default async function CopyrightPage() {
  return await renderPublicPage("copyright");
}
