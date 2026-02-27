import { Separator } from "@components/ui/separator";
import { Breadcrumbs } from "./breadcrumbs";
import { Search } from "./search";

interface Props {
  path?: string;
  children?: React.ReactNode;
}

export const Main: React.FC<Props> = ({ path, children }) => (
  <div className="relative">
    <div className="flex flex-col gap-4 max-w-4xl m-auto pb-12 -mt-20">
      <Search />
      <Separator />
      {(path ?? "/") === "/" ? null : <Breadcrumbs path={path} />}
      {children}
    </div>
  </div>
);
