import type { FC } from "react";

export type Widget = {
  path: string;
  component: FC;
};

export type WidgetResolver = () => Promise<Widget>;

export type Widgets = {
  pattern: RegExp;
  widgets: WidgetResolver[];
}[];
