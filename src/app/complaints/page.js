import { generatePublicPageMetadata, renderPublicPage } from "@/shared/publicPageHelper";

export async function generateMetadata() {
  return await generatePublicPageMetadata("complaints");
}

export default async function ComplaintsPage() {
  return await renderPublicPage("complaints");
}
