import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/_index.tsx"),
    route("/upload", "routes/upload.tsx"),
    route("/dashboard", "routes/dashboard.tsx"),
    route("/resume/:id", "routes/resume.tsx"),
    route('delete', 'routes/delete.tsx'),
] satisfies RouteConfig;
