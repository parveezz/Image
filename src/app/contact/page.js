import { generatePublicPageMetadata, renderPublicPage } from "@/shared/publicPageHelper";

export async function generateMetadata() {
  return await generatePublicPageMetadata("contact");
}

export default async function ContactPage() {
  return await renderPublicPage("contact");
}
