import { Separator } from "@components/ui/separator";
import { PathBreadcrumbs } from "./breadcrumbs";

interface Props {
  path?: string;
  children?: React.ReactNode;
}

export const Main: React.FC<Props> = ({ path, children }) => (
  <div className="relative">
    <div className="flex flex-col gap-4 max-w-5xl m-auto pb-12 -mt-20">
      <Separator />
      <PathBreadcrumbs path={path ?? "/"} />
      {children}
    </div>
  </div>
);
