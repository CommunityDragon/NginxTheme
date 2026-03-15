import { HandHeart, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "@/assets/logo-small.png";
import whiteLogo from "@/assets/logo-small-white.png";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/hooks/settings";
import { cn } from "@/lib/client/utils";
import { Button } from "../ui/button";
import { Search } from "./search";

export const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();
  const { settings, toggle } = useSettings();

  useEffect(() => {
    if (!settings.visual.show_hero) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 160);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [settings.visual.show_hero]);

  return (
    <header
      className={cn(
        "top-0 z-50 w-full transition-colors duration-200",
        isScrolled || !settings.visual.show_hero
          ? "bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80"
          : "bg-transparent dark text-foreground",
        settings.visual.show_hero ? "fixed" : "sticky",
      )}
    >
      <div className="3xl:fixed:px-0 px-6 flex gap-4 items-center **:transition-colors **:duration-200">
        <a href="/" className="block">
          <picture className="h-full w-full">
            <source srcSet={whiteLogo} media="(prefers-color-scheme: dark)" />
            <img
              alt={t("accessibility.communityDragonLogo")}
              src={logo}
              height="32"
              width="32"
            />
          </picture>
        </a>

        <div className="flex items-center py-2 grow">
          <div className="grow">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent",
                      "duration-0!",
                    )}
                    render={<a href="/">{t("navbar.home")}</a>}
                  />
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    {t("navbar.projects")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <ListItem
                        href="https://raw.communitydragon.org"
                        title={t("navbar.projectsMenu.raw.title")}
                      >
                        {t("navbar.projectsMenu.raw.description")}
                      </ListItem>
                      <ListItem
                        href="https://cdn.communitydragon.org"
                        title={t("navbar.projectsMenu.cdn.title")}
                      >
                        {t("navbar.projectsMenu.cdn.description")}
                      </ListItem>
                      <ListItem
                        href="https://universe.communitydragon.org/events"
                        title={t("navbar.projectsMenu.universe.title")}
                      >
                        {t("navbar.projectsMenu.universe.description")}
                      </ListItem>
                      <ListItem
                        href="https://raw.communitydragon.org/binviewer/"
                        title={t("navbar.projectsMenu.binViewer.title")}
                      >
                        {t("navbar.projectsMenu.binViewer.description")}
                      </ListItem>
                      <ListItem
                        href="https://pypi.org/project/cdtb"
                        title={t("navbar.projectsMenu.cdtb.title")}
                      >
                        {t("navbar.projectsMenu.cdtb.description")}
                      </ListItem>
                      <ListItem
                        href="https://github.com/CommunityDragon/Data"
                        title={t("navbar.projectsMenu.hashes.title")}
                      >
                        {t("navbar.projectsMenu.hashes.description")}
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    {t("navbar.links")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <ListItem
                        href="https://github.com/CommunityDragon/awesome-league"
                        title={t("navbar.linksMenu.awesomeList.title")}
                      >
                        {t("navbar.linksMenu.awesomeList.description")}
                      </ListItem>
                      <ListItem
                        href="https://github.com/CommunityDragon"
                        title={t("navbar.linksMenu.github.title")}
                      >
                        {t("navbar.linksMenu.github.description")}
                      </ListItem>
                      <ListItem
                        href="https://github.com/CommunityDragon/Docs"
                        title={t("navbar.linksMenu.docs.title")}
                      >
                        {t("navbar.linksMenu.docs.description")}
                      </ListItem>
                      <ListItem
                        href="https://www.communitydragon.org/blog"
                        title={t("navbar.linksMenu.blog.title")}
                      >
                        {t("navbar.linksMenu.blog.description")}
                      </ListItem>
                      <ListItem
                        href="https://discord.gg/rZQwuek"
                        title={t("navbar.linksMenu.discord.title")}
                      >
                        {t("navbar.linksMenu.discord.description")}
                      </ListItem>
                      <ListItem
                        href="https://www.patreon.com/communitydragon"
                        title={t("navbar.linksMenu.patreon.title")}
                      >
                        {t("navbar.linksMenu.patreon.description")}
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem
                className={
                  isScrolled || !settings.visual.show_hero ? "" : "hidden"
                }
              >
                <Search />
              </NavigationMenuItem>
              <NavigationMenuItem
                className={
                  isScrolled || !settings.visual.show_hero ? "" : "hidden"
                }
              >
                <Separator orientation="vertical" className="h-6 mx-4" />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button
                  variant="destructive"
                  nativeButton={false}
                  render={
                    <a href="https://www.patreon.com/communitydragon">
                      {t("navbar.supportUs")} <HandHeart />
                    </a>
                  }
                />
              </NavigationMenuItem>
              <NavigationMenuItem className="ml-2">
                <Button
                  variant="ghost"
                  onClick={() => toggle(true)}
                  size="icon"
                >
                  <Settings />
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink
        render={
          <a href={href}>
            <div className="flex flex-col gap-1 text-sm">
              <div className="leading-none font-medium">{title}</div>
              <div className="text-muted-foreground line-clamp-2">
                {children}
              </div>
            </div>
          </a>
        }
      />
    </li>
  );
}
