import { generatePublicPageMetadata, renderPublicPage } from "@/shared/publicPageHelper";

export async function generateMetadata() {
  return await generatePublicPageMetadata("help");
}

export default async function HelpPage() {
  return await renderPublicPage("help");
}
