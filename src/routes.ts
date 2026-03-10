import { type RouteConfig, route } from "@react-router/dev/routes";

export default [route("*?", "app.tsx")] satisfies RouteConfig;
