const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserSite = repositoryName.endsWith(".github.io");
const githubBasePath = process.env.GITHUB_ACTIONS && !isUserSite ? `/${repositoryName}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: githubBasePath,
  assetPrefix: githubBasePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: githubBasePath,
  },
};

export default nextConfig;
