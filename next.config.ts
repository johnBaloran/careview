import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Don't generate AGENTS.md when `next dev` runs under an AI agent; agent instructions live in CLAUDE.md.
  agentRules: false,
};

export default nextConfig;
