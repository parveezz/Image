import { generatePublicPageMetadata, renderPublicPage } from "@/shared/publicPageHelper";

export async function generateMetadata() {
  return await generatePublicPageMetadata("acceptable-use");
}

export default async function AcceptableUsePage() {
  return await renderPublicPage("acceptable-use");
}
