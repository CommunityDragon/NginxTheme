import logo from "@assets/logo-small.png";

import whiteLogo from "@assets/logo-small-white.png";
import { cn } from "@lib/utils";
import { HandHeart } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "../ui/button";

export const NavBar: React.FC = () => {
  return (
    <header className="bg-transparent fixed top-0 z-50 w-full">
      <div className="3xl:fixed:px-0 px-6 flex gap-4 items-center">
        <a href="/" className="block">
          <picture className="h-full w-full">
            <source srcset={whiteLogo} media="(prefers-color-scheme: dark)" />
            <img alt="CommunityDragon" src={logo} height="32" width="32" />
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
                    )}
                    render={<a href="/">Home</a>}
                  />
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    Projects
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <ListItem
                        href="https://raw.communitydragon.org"
                        title="RAW"
                      >
                        All raw assets extracted from League of Legends LCU and
                        game client
                      </ListItem>
                      <ListItem
                        href="https://cdn.communitydragon.org"
                        title="CDN"
                      >
                        A custom CDN to serve static data simplifying accessing
                        Riot's assets
                      </ListItem>
                      <ListItem
                        href="https://universe.communitydragon.org/events"
                        title="Universe"
                      >
                        A tool to find, view, and decrypt Riot's .bin files
                      </ListItem>
                      <ListItem
                        href="https://raw.communitydragon.org/binviewer/"
                        title=".BIN Viewer"
                      >
                        A tool to find, view, and decrypt Riot's .bin files
                      </ListItem>
                      <ListItem
                        href="https://pypi.org/project/cdtb"
                        title="CDTB"
                      >
                        A toolbox to work with game files and export files from
                        Riot Games
                      </ListItem>
                      <ListItem
                        href="https://github.com/CommunityDragon/Data"
                        title="Hashes"
                      >
                        A repository containing all known file hashes from Riot
                        Games
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    Links
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <ListItem
                        href="https://github.com/CommunityDragon/awesome-league"
                        title="Awesome List"
                      >
                        A list of things that work with the League of Legends
                        APIs
                      </ListItem>
                      <ListItem
                        href="https://github.com/CommunityDragon"
                        title="GitHub"
                      >
                        Our GitHub page containing all our repo's and tools
                      </ListItem>
                      <ListItem
                        href="https://github.com/CommunityDragon/Docs"
                        title="Docs"
                      >
                        Documentation surrounding the Riot's game data and
                        related tools
                      </ListItem>
                      <ListItem
                        href="https://www.communitydragon.org/blog"
                        title="Blog"
                      >
                        Our blog page regarding updates to CommunityDragon
                      </ListItem>
                      <ListItem
                        href="https://discord.gg/rZQwuek"
                        title="Discord"
                      >
                        Our Community's Discord group. Feel free to join for
                        discussions and questions
                      </ListItem>
                      <ListItem
                        href="https://www.patreon.com/communitydragon"
                        title="Patreon"
                      >
                        Our Patreon in case you want to support us. Any help is
                        appreciated ❤️
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Button
                  variant="destructive"
                  nativeButton={false}
                  render={
                    <a href="https://www.patreon.com/communitydragon">
                      Support us <HandHeart />
                    </a>
                  }
                />
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
