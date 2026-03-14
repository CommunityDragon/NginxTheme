import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { useSettings } from "@/hooks/settings";

interface CheckboxFieldProps {
  target: string;
  label: string;
  checked: boolean;
  update: (key: string, value: unknown) => unknown;
}

export const SettingsDrawer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { settings, update, active, toggle } = useSettings();

  return (
    <div>
      <Drawer
        direction="right"
        open={active}
        onClose={() => toggle(false)}
        handleOnly={false}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{t("settings.title")}</DrawerTitle>
            <DrawerDescription>{t("settings.description")}</DrawerDescription>
          </DrawerHeader>
          <div className="no-scrollbar overflow-y-auto px-4">
            <FieldSeparator />
            <br />
            <FieldGroup>
              <FieldSet>
                <FieldLegend variant="label">
                  {t("settings.visual.title")}
                </FieldLegend>
                <FieldDescription>
                  {t("settings.visual.description")}
                </FieldDescription>
                <FieldGroup>
                  <CheckboxField
                    target="visual.show_hero"
                    label={t("settings.visual.showHero")}
                    checked={settings.visual.show_hero}
                    update={update}
                  />

                  <CheckboxField
                    target="visual.show_background"
                    label={t("settings.visual.showBackground")}
                    checked={settings.visual.show_background}
                    update={update}
                  />
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
            <br />
            <FieldSeparator />
            <br />
            <FieldGroup>
              <FieldSet>
                <FieldLegend variant="label">
                  {t("settings.language.title")}
                </FieldLegend>
                <FieldDescription>
                  {t("settings.language.description")}
                </FieldDescription>
                <FieldGroup>
                  <Field orientation="vertical" className="gap-2">
                    <select
                      value={i18n.language}
                      onChange={(e) => i18n.changeLanguage(e.target.value)}
                      className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      <option value="en">{t("settings.language.en")}</option>
                      <option value="es">{t("settings.language.es")}</option>
                      <option value="nl">{t("settings.language.nl")}</option>
                      <option value="zh">{t("settings.language.zh")}</option>
                      <option value="de">{t("settings.language.de")}</option>
                      <option value="fr">{t("settings.language.fr")}</option>
                      <option value="ko">{t("settings.language.ko")}</option>
                    </select>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  target,
  label,
  checked,
  update,
}) => (
  <Field orientation="horizontal">
    <Checkbox
      id={target.replaceAll(".", "-")}
      checked={checked}
      onCheckedChange={(checked) => {
        update(target, checked);
      }}
    />
    <FieldLabel htmlFor={target.replaceAll(".", "-")} className="font-normal">
      {label}
    </FieldLabel>
  </Field>
);
