import { AliasOptions, defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import path from "path";

const pathAlias: AliasOptions = [
  { find: "@pages", replacement: path.resolve(__dirname, "src/pages") },
  {
    find: "@components",
    replacement: path.resolve(__dirname, "src/components"),
  },
  {
    find: "@hooks",
    replacement: path.resolve(__dirname, "src/hooks"),
  },
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }: any) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      port: Number(env.PORT),
    },
    plugins: [react(), UnoCSS()],
    resolve: {
      alias: [{ find: /^~/, replacement: "" }, ...pathAlias],
    },
    css: {
      modules: {
        generateScopedName: "ecom-[local]-[hash:base64:5]",
        localsConvention: "camelCaseOnly",
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import "src/styles/vars.less";`,
        },
      },
    },
  };
});
