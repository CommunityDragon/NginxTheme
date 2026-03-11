import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/hooks/settings";
import { cn } from "@/lib/client/utils";
import { Breadcrumbs } from "./breadcrumbs";
import { Search } from "./search";

interface Props {
  path?: string;
  children?: React.ReactNode;
}

export const Main: React.FC<Props> = ({ path, children }) => {
  const { settings } = useSettings();

  return (
    <div className="relative">
      <div
        className={cn(
          "flex flex-col gap-4 max-w-4xl m-auto pb-12",
          settings.visual.show_hero ? "-mt-20" : "pt-8",
        )}
      >
        {settings.visual.show_hero ? (
          <>
            <Search />
            <Separator />
          </>
        ) : null}
        {(path ?? "/") === "/" ? null : <Breadcrumbs path={path} />}
        {children}
      </div>
    </div>
  );
};
