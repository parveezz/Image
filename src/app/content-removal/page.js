import { generatePublicPageMetadata, renderPublicPage } from "@/shared/publicPageHelper";

export async function generateMetadata() {
  return await generatePublicPageMetadata("content-removal");
}

export default async function ContentRemovalPage() {
  return await renderPublicPage("content-removal");
}
