# Use a lightweight Node.js base image with Bun preinstalled
FROM oven/bun:latest

# Install yt-dlp
RUN apt update && apt install -y curl ffmpeg python3 && rm -rf /var/lib/apt/lists/*

RUN echo "Downloading yt-dlp..."
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp

# Make it executable
RUN chmod a+rx /usr/local/bin/yt-dlp

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json bun.lockb ./
RUN bun install

# Copy the rest of the application
COPY . .

# Expose the application port (change if needed)
EXPOSE 3000

RUN bun run build

# Run the Bun application
CMD ["bun", "run", "start"]
