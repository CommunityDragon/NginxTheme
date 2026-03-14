import { useTranslation } from "react-i18next";
import heroImage from "@/assets/hero.jpg";
import logo from "@/assets/logo.png";
import whiteLogo from "@/assets/logo-white.png";
import { useSettings } from "@/hooks/settings";

export const Hero: React.FC = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();

  const showHero = settings.visual.show_hero;
  const showBackground = showHero && settings.visual.show_background;

  return showHero ? (
    <div
      className="bg-cover bg-center"
      style={{
        backgroundImage: showBackground ? `url('${heroImage}')` : "none",
      }}
    >
      <div className="pt-16 pb-24 bg-linear-to-b from-background/20 to-background">
        <div className="relative py-8">
          <div className="flex gap-4 w-min m-auto items-center align-middle">
            <div className="grow">
              <h1 className="scroll-m-20 text-right text-4xl font-extrabold tracking-tight text-nowrap">
                {t("hero.title")} <br />
                {t("hero.subtitle")}
              </h1>
            </div>
            <div>
              <picture className="h-auto w-20 block">
                <source
                  srcSet={whiteLogo}
                  media="(prefers-color-scheme: dark)"
                />
                <img
                  alt={t("accessibility.communityDragonLogo")}
                  src={logo}
                  height="128"
                  width="128"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
