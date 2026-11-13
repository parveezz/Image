import { generatePublicPageMetadata, renderPublicPage } from "@/shared/publicPageHelper";

export async function generateMetadata() {
  return await generatePublicPageMetadata("faqs");
}

export default async function FaqsPage() {
  return await renderPublicPage("faqs");
}
