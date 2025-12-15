import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { type RouteConfigEntry, index, route } from "@react-router/dev/routes";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

type Tree = {
  path: string;
  children: Tree[];
  hasPage: boolean;
};

function buildRouteTree(dir: string, basePath = ""): Tree {
  const files = readdirSync(dir);
  const node: Tree = { path: basePath, children: [], hasPage: false };

  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      const childPath = basePath ? `${basePath}/${file}` : file;
      node.children.push(buildRouteTree(filePath, childPath));
    } else if (file === "page.jsx") {
      node.hasPage = true;
    }
  }

  return node;
}

function segmentToRoutePart(segment: string) {
  if (segment.startsWith("[") && segment.endsWith("]")) {
    const inner = segment.slice(1, -1);
    if (inner.startsWith("...")) return "*";
    if (inner.startsWith("[") && inner.endsWith("]")) {
      return `:${inner.slice(1, -1)}?`;
    }
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
      routes.push(index(componentPath, { id: "page:/" }));
    } else {
      const processed = node.path
        .split("/")
        .map(segmentToRoutePart)
        .join("/");

      routes.push(
        route(processed, componentPath, { id: `page:/${processed}` })
      );
    }
  }

  for (const child of node.children) {
    routes.push(...generateRoutes(child));
  }

  return routes;
}

const notFound = route("*", "./not-found.jsx", { id: "not-found" });

const tree = buildRouteTree(__dirname);
const routes = [...generateRoutes(tree), notFound];

export default routes;
