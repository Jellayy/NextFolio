/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        }
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos'
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1'
            }
        ]
    }
};

export default config;
