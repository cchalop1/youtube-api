import { Elysia } from "elysia";
import { exec } from "child_process";
import { promisify } from "util";
import { file } from "bun";

const execAsync = promisify(exec);

const app = new Elysia()
  .get("/", () => "Hello Elysia")
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

      console.log(stdout);

      return file("subtitle.en.vtt");
    } catch (error: any) {
      return { error: error.message };
    }
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
