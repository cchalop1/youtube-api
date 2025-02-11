import { Elysia } from "elysia";
import { exec } from "child_process";
import { promisify } from "util";
import { file } from "bun";
import { cleanVTT } from "./utils";

const execAsync = promisify(exec);

const app = new Elysia()
  .get("/", () => file("public/openai.json"))
  .get("/privacy", () => file("public/privacy.html"))
  .get("/info/", async ({ query: { url } }) => {
    console.log(url);
    if (!url) {
      return { error: "URL is required" };
    }

    try {
      const { stdout } = await execAsync(`yt-dlp -J ${url}`);
      const videoInfo = JSON.parse(stdout);

      const { title, description } = videoInfo;
      return { title, description };
    } catch (error: any) {
      return { error: error.message };
    }
  })
  .get("/subtitles/", async ({ query: { url } }) => {
    if (!url) {
      return { error: "URL is required" };
    }

    try {
      const { stdout } = await execAsync(
        `yt-dlp --write-auto-subs  --sub-format vtt -o subtitle --skip-download ${url}`
      );
      await cleanVTT("subtitle.en.vtt", "subtitle.en.clean.vtt");

      return file("subtitle.en.clean.vtt");
    } catch (error: any) {
      return { error: error.message };
    }
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
