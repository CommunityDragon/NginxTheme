import { useEffect, useState } from "react";
import { useIndex } from "@/hooks/nginx";
import type { Widget } from "@/types/widgets";
import { widgets } from "@/widgets";

export const Widgets: React.FC = () => {
  const { path } = useIndex();
  const [loading, setLoading] = useState(false);
  const [components, setComponents] = useState<Widget[]>([]);

  useEffect(() => {
    setLoading(true);
    const resolvers = widgets
      .filter(({ pattern }) => pattern.test(path))
      .flatMap(({ widgets }) => widgets)
      .map((resolver) => resolver());

    console.log(resolvers);

    const resolved = Promise.all(resolvers).then((widgets) => {
      setComponents(widgets);
      console.log("AAA");
      setLoading(false);
    });

    return () => {
      resolved.then(() => null);
    };
  }, [path]);

  return loading && widgets.length > 0 ? null : (
    <div className="mt-2 mb-4">
      {components.map(({ path, component: Component }) => (
        <Component key={path} />
      ))}
    </div>
  );
};
