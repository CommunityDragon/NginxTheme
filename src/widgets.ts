import { widget } from "@/lib/client/widgets";
import type { Widgets } from "@/types/widgets";

export const widgets: Widgets = [
  {
    pattern: /^\/$/,
    widgets: [widget("../../../../src/components/widgets/hello-world")],
  },
];
