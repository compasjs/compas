import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
//
// eslint-disable-next-line import-x/no-default-export
export default defineConfig({
  plugins: [react()],
});
