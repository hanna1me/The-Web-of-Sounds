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

function toRoutePath(fsPath: string) {
  // Convert [id] -> :id, [...all] -> *
  const segments = fsPath.split("/").filter(Boolean);
  return segments
    .map((seg) => {
      if (seg.startsWith("[") && seg.endsWith("]")) {
        const name = seg.slice(1, -1);
        if (name.startsWith("...")) return "*";
        return `:${name}`;
      }
      return seg;
    })
    .join("/");
}

function generateRoutes(node: Tree): RouteConfigEntry[] {
  const out: RouteConfigEntry[] = [];

  if (node.hasPage) {
    const componentPath = node.path === "" ? "./page.jsx" : `./${node.path}/page.jsx`;

    if (node.path === "") {
      out.push(index(componentPath, { id: "page:/" }));
    } else {
      const routePath = toRoutePath(node.path);
      out.push(route(routePath, componentPath, { id: `page:/${routePath}` }));
    }
  }

  for (const child of node.children) {
    out.push(...generateRoutes(child));
  }

  return out;
}

const tree = buildRouteTree(__dirname);

// SPA mode: keep not-found COMPONENT ONLY (no loader/action)
const notFound = route("*", "./__create/not-found.tsx", { id: "not-found" });

export default [...generateRoutes(tree), notFound];
