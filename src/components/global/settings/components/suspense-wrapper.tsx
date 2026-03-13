import { Suspense, useEffect, useState } from "react";
import { useSettings } from "@/hooks/settings";
import type { SettingsDrawer } from "./settings-drawer";

export const SuspenseWrapper: React.FC = () => {
  const { active } = useSettings();
  const [Component, setComponent] = useState<typeof SettingsDrawer | null>(
    null,
  );

  useEffect(() => {
    if (active && !Component) {
      import("./settings-drawer").then((mod) =>
        setComponent(() => mod.SettingsDrawer),
      );
    }
  }, [active, Component]);

  return <Suspense>{Component && <Component />}</Suspense>;
};
