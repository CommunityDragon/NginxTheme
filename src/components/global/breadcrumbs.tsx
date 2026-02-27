import { Home, type LucideIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  path?: string;
}

type crumb = {
  label: string | LucideIcon;
  href: string;
};

export const Breadcrumbs: React.FC<Props> = ({ path = "/" }) => {
  const segments = path.split("/").filter((segment) => segment !== "");

  const breadcrumbs: crumb[] = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}/`;
    return {
      label: segment,
      href,
    };
  });

  const allItems = [
    { label: <Home size={16} strokeWidth={1} />, href: "/" },
    ...breadcrumbs,
  ];

  const maxVisible = 6;
  const isTooLong = allItems.length > maxVisible;

  const itemsToDisplay = isTooLong
    ? [
        ...allItems.slice(0, maxVisible - 2),
        allItems.slice(maxVisible - 2, allItems.length - 1),
        allItems[allItems.length - 1],
      ]
    : allItems;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {itemsToDisplay.map((item, i) => (
          <>
            {i !== 0 ? <BreadcrumbSeparator /> : null}
            <BreadcrumbItem>
              {Array.isArray(item) ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    nativeButton={false}
                    render={
                      <span>
                        <Button size="icon-sm" variant="ghost">
                          <BreadcrumbEllipsis />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </span>
                    }
                  />
                  <DropdownMenuContent
                    align="start"
                    style={{ "--anchor-width": "auto" }}
                    className="text-nowrap"
                  >
                    <DropdownMenuGroup>
                      {item.map((subItem) => (
                        <DropdownMenuItem
                          render={<a href={subItem.href}>{subItem.label}</a>}
                        />
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <BreadcrumbLink render={<a href={item.href}>{item.label}</a>} />
              )}
            </BreadcrumbItem>
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
