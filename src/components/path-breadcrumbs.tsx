import React from "react"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface Props {
  path: string
}

type crumb = {
    label: string;
    href: string;
}

export function PathBreadcrumbs({ path }: Props) {
  const segments = path.split("/").filter((segment) => segment !== "")

  const breadcrumbs: crumb[] = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}/`
    return {
      label: segment,
      href,
    }
  })

  const allItems = breadcrumbs.length === 0 ? [{ label: "Home", href: "/" }] : breadcrumbs;

  const maxVisible = 6
  const isTooLong = allItems.length > maxVisible

  const itemsToDisplay = isTooLong
    ? [...allItems.slice(0, maxVisible - 2), allItems.slice(maxVisible - 2, allItems.length - 1), allItems[allItems.length - 1]]
    : allItems

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {itemsToDisplay.map((item, i) => (
            <>
                {i !== 0 ? (
                    <BreadcrumbSeparator />
                ) : null}
                <BreadcrumbItem>
                    {Array.isArray(item) ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger nativeButton={false} render={
                                <span> 
                                    <Button size="icon-sm" variant="ghost">
                                        <BreadcrumbEllipsis />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </span>
                            }/>
                            <DropdownMenuContent align="start" style={{'--anchor-width': 'auto',}} className='text-nowrap'>
                            <DropdownMenuGroup>
                                {item.map((subItem) => (
                                    <DropdownMenuItem render={
                                        <a href={subItem.href}>{subItem.label}</a>
                                    }/>
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
  )
}