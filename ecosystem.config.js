module.exports = {
  apps: [
    {
      name: "portfolio-app",
      script: "pnpm",
      args: "run start",
      interpreter: "none",
      cwd: "./",
      watch: false,
      env: {
        NODE_ENV: "production"
      },
      post_update: ["pnpm install", "pnpm run build"]
    }
  ]
};
