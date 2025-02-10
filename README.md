# YouTube Resume GPT Action

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.12. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## API Endpoints

### GET /

Returns a simple greeting message.

### POST /extract

Extracts the title, description, and subtitles from a YouTube video.

#### Request Body

```json
{
  "url": "https://www.youtube.com/watch?v=example"
}
```

#### Response

```json
{
  "title": "Video Title",
  "description": "Video Description",
  "subtitles": {
    "en": "https://example.com/subtitles.en.vtt"
  }
}
```
