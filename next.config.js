const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})
// const withPWA = object => {
//   return object
// }
// const withInit = require('next-in-it-stats')({ legacy: true })

module.exports = withPWA({
  reactStrictMode: true,
  eslint: {
    dirs: ['pages', 'utils'],
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
})
