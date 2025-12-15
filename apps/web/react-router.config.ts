import type { Config } from "@react-router/dev/config";

export default {
  // ✅ your app lives here
  appDirectory: "src/app",

  // ✅ SPA deploy (no server output / hono scanning)
  ssr: false,
} satisfies Config;
