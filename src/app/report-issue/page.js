import { generatePublicPageMetadata, renderPublicPage } from "@/shared/publicPageHelper";

export async function generateMetadata() {
  return await generatePublicPageMetadata("report-issue");
}

export default async function ReportIssuePage() {
  return await renderPublicPage("report-issue");
}
