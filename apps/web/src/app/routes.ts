import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { type RouteConfigEntry, index, route } from "@react-router/dev/routes";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

type Tree = {
  path: string;
  children: Tree[];
  hasPage: boolean;
  isParam: boolean;
  paramName: string;
  isCatchAll: boolean;
};

function buildRouteTree(dir: string, basePath = ""): Tree {
  const files = readdirSync(dir);

  const node: Tree = {
    path: basePath,
    children: [],
    hasPage: false,
    isParam: false,
    isCatchAll: false,
    paramName: "",
  };

  // Check if the current directory name indicates a parameter
  const dirName = basePath.split("/").pop();
  if (dirName?.startsWith("[") && dirName.endsWith("]")) {
    node.isParam = true;
    const paramName = dirName.slice(1, -1);

    // Catch-all param folder: [...ids]
    if (paramName.startsWith("...")) {
      node.isCatchAll = true;
      node.paramName = paramName.slice(3);
    } else {
      node.paramName = paramName;
    }
  }

  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      const childPath = basePath ? `${basePath}/${file}` : file;
      const childNode = buildRouteTree(filePath, childPath);
      node.children.push(childNode);
    } else if (file === "page.jsx") {
      node.hasPage = true;
    }
  }

  return node;
}

function segmentToRouteSegment(segment: string): string {
  // [id] -> :id
  // [...ids] -> *
  if (segment.startsWith("[") && segment.endsWith("]")) {
    const inner = segment.slice(1, -1);
    if (inner.startsWith("...")) return "*";
    return `:${inner}`;
  }
  return segment;
}

function generateRoutes(node: Tree): RouteConfigEntry[] {
  const routes: RouteConfigEntry[] = [];

  if (node.hasPage) {
    const componentPath =
      node.path === "" ? "./page.jsx" : `./${node.path}/page.jsx`;

    if (node.path === "") {
      // Root index route
      routes.push(index(componentPath, { id: "page:/" }));
    } else {
      // Convert folder path into a URL path (handling [param] folders)
      const segments = node.path.split("/").filter(Boolean);
      const routePath = segments.map(segmentToRouteSegment).join("/");

      routes.push(route(routePath, componentPath, { id: `page:${routePath}` }));
    }
  }

  for (const child of node.children) {
    routes.push(...generateRoutes(child));
  }

  return routes;
}

// Dev-only: make Vite aware of page.jsx files for HMR
if ((import.meta as any).env?.DEV) {
  (import.meta as any).glob("./**/page.jsx", {});
  if ((import.meta as any).hot) {
    (import.meta as any).hot.accept(() => {
      (import.meta as any).hot?.invalidate();
    });
  }
}

console.log("ROUTES __dirname:", __dirname);

const tree = buildRouteTree(__dirname);

// Not found route (unique id)
const notFound = route("*", "./__create/not-found.tsx", { id: "not-found" });

// IMPORTANT: do NOT add another index("./page.jsx") here; generateRoutes already does it.
const routes = [...generateRoutes(tree), notFound];

export default routes;
