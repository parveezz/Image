import FooterPageEditor from "@/components/admin/FooterPageEditor";

export const metadata = {
      title: "Create Footer Page | Imagely Admin",
      description: "Create a new legal or support footer page.",
};

export default function CreateFooterPage() {
      return (
            <div>
                  <FooterPageEditor mode="create" />
            </div>
      );
}
