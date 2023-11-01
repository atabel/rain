const {createVanillaExtractPlugin} = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    // logging: {
    //     fetches: {
    //         fullUrl: true,
    //     },
    // },
    experimental: {
        logging: {
            fetches: {
                fullUrl: true,
            },
            level: 'verbose',
        },
    },
};

module.exports = withVanillaExtract(nextConfig);
