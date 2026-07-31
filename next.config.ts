import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Dev-only: allow opening the dev server via the machine's LAN IP
  // (e.g. from a phone). Has no effect on production builds.
  allowedDevOrigins: ['192.168.195.95'],
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { hostname: 'res.cloudinary.com', protocol: 'https' },
      { hostname: 'avatars.githubusercontent.com', protocol: 'https' },
      { hostname: 'imgur.com', protocol: 'https' },
      { hostname: 'media2.dev.to', protocol: 'https' },
    ],
  },
};

export default nextConfig;
