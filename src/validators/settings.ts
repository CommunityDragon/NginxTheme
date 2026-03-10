import { z } from "zod";
import { defaultObject } from "@/lib/client/validators";

export const SettingsSchema = defaultObject({
  visual: defaultObject({
    show_background: z.boolean().default(true),
    show_logo: z.boolean().default(true),
    show_widgets: z.boolean().default(true),
    custom_background: z.string().nullable().default(null),
  }),
  search: defaultObject({
    max_results: z.number().default(10000),
  }),
});

export type Settings = z.infer<typeof SettingsSchema>;
