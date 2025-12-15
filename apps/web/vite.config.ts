import path from "node:path";
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import babel from "vite-plugin-babel";
import tsconfigPaths from "vite-tsconfig-paths";

import { addRenderIds } from "./plugins/addRenderIds";
import { aliases } from "./plugins/aliases";
import consoleToParent from "./plugins/console-to-parent";
import { layoutWrapperPlugin } from "./plugins/layouts";
import { loadFontsFromTailwindSource } from "./plugins/loadFontsFromTailwindSource";
import { nextPublicProcessEnv } from "./plugins/nextPublicProcessEnv";
import { restart } from "./plugins/restart";
import { restartEnvFileChange } from "./plugins/restartEnvFileChange";

// IMPORTANT: only use hono dev server plugin in development
const isDev = process.env.NODE_ENV !== "production";

export default defineConfig({
  envPrefix: "NEXT_PUBLIC_",
  logLevel: "info",

  optimizeDeps: {
    include: ["fast-glob", "lucide-react", "d3"],
    exclude: [
      "@hono/auth-js/react",
      "@hono/auth-js",
      "@auth/core",
      "hono/context-storage",
      "@auth/core/errors",
      "fsevents",
      "lightningcss",
    ],
  },

  plugins: [
    nextPublicProcessEnv(),
    restartEnvFileChange(),

    // Keep styled-jsx transform
    babel({
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      exclude: /node_modules/,
      babelConfig: {
        babelrc: false,
        configFile: false,
        plugins: ["styled-jsx/babel"],
      },
    }),

    restart({
      restart: [
        "src/**/page.jsx",
        "src/**/page.tsx",
        "src/**/layout.jsx",
        "src/**/layout.tsx",
        "src/**/route.js",
        "src/**/route.ts",
      ],
    }),

    consoleToParent(),
    loadFontsFromTailwindSource(),
    addRenderIds(),

    // React Router plugin (this is what Vercel should build with)
    reactRouter(),

    tsconfigPaths(),
    aliases(),
    layoutWrapperPlugin(),

    // DEV-ONLY: react-router-hono-server (prevents prod build weirdness)
    ...(isDev
      ? [
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require("react-router-hono-server/dev").reactRouterHonoServer({
            serverEntryPoint: "./__create/index.ts",
            runtime: "node",
          }),
        ]
      : []),
  ],

  resolve: {
    alias: {
      lodash: "lodash-es",
      "npm:stripe": "stripe",
      stripe: path.resolve(__dirname, "./src/__create/stripe"),
      "@auth/create/react": "@hono/auth-js/react",
      "@auth/create": path.resolve(__dirname, "./src/__create/@auth/create"),
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },

  clearScreen: false,

  server: {
    allowedHosts: true,
    host: "0.0.0.0",
    port: 4000,
    hmr: { overlay: false },
    warmup: {
      clientFiles: ["./src/app/**/*", "./src/app/root.tsx", "./src/app/routes.ts"],
    },
  },

  // Helps avoid esbuild target issues if anything uses modern syntax
  build: {
    target: "es2022",
  },
});

