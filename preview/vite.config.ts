import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { renderPlugin } from "./src/server/render-plugin";

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, "..");

export default defineConfig({
    root: here,
    base: "/",
    publicDir: path.join(projectRoot, "public"),
    plugins: [react(), renderPlugin({ projectRoot })],
    resolve: {
        dedupe: ["react", "react-dom", "remotion", "@remotion/player", "@remotion/media", "three"],
        alias: { "@src": path.join(projectRoot, "src") },
    },
    server: {
        host: "127.0.0.1",
        port: 5180,
        strictPort: true,
        open: true,
        fs: { allow: [projectRoot] },
        watch: { ignored: ["**/out/**", "**/dist-preview/**"] },
    },
    optimizeDeps: {
        include: [
            "react",
            "react-dom",
            "react-dom/client",
            "remotion",
            "@remotion/player",
            "@remotion/media",
            "@remotion/three",
            "@react-three/fiber",
            "three",
        ],
    },
    build: {
        outDir: path.join(projectRoot, "dist-preview"),
        emptyOutDir: true,
    },
});
