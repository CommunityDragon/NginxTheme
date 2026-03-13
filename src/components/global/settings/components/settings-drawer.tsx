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
            <DrawerTitle>Settings</DrawerTitle>
            <DrawerDescription>
              Change the settings the way you like it.
            </DrawerDescription>
          </DrawerHeader>
          <div className="no-scrollbar overflow-y-auto px-4">
            <FieldSeparator />
            <br />
            <FieldGroup>
              <FieldSet>
                <FieldLegend variant="label">Visual</FieldLegend>
                <FieldDescription>
                  Personalise visual elements on the website. Make the website
                  your own ❤️
                </FieldDescription>
                <FieldGroup>
                  <CheckboxField
                    target="visual.show_hero"
                    label="Show hero section"
                    checked={settings.visual.show_hero}
                    update={update}
                  />

                  <CheckboxField
                    target="visual.show_background"
                    label="Show background image"
                    checked={settings.visual.show_background}
                    update={update}
                  />
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
