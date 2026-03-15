import { widgets } from "@/widgets";

const _loadWidgets = async () => {
  await Promise.all(
    widgets.flatMap(({ widgets }) => widgets).map((resolver) => resolver()),
  );
};
