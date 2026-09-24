import type { NextConfig } from 'next'

// Vanity redirect targets. Read here rather than from `@/config` because
// next.config runs outside the module alias.
const CLI_URL = process.env.NEXT_PUBLIC_CLI_URL ?? 'https://devfest-cli.web.app'

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  async redirects() {
    return [
      {
        // Vanity URL for the DevFest CLI. Temporary (307) rather than
        // permanent (308) so the destination stays changeable via env —
        // a 308 is cached by browsers indefinitely.
        source: '/cli',
        destination: CLI_URL,
        permanent: false,
        // Required for redirects that leave the app.
        basePath: false,
      },
    ]
  },
}

export default nextConfig
