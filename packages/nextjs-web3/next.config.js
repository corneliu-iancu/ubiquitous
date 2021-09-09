module.exports = {
    exportTrailingSlash: true,
    trailingSlash: false,
    experimental: {
      externalDir: true,
    },
    images: {
      loader: "imgix",
      path: "",
    },
    exportPathMap: async function (
      defaultPathMap,
      { dev, dir, outDir, distDir, buildId }
    ) {
        return {
          '/': { page: '/' },
          '/account': { page: '/account' },
          '/account/minted': { page: '/account/minted'},
          '/account/history': { page: '/account/history' },
          '/account/hidden': { page: '/account/hidden' },
          '/account/favorited': { page: '/account/favorited' },
          '/account/collected': { page: '/account/collected' },
          '/account/offers/received': { page: '/account/offers/received' },
          '/account/offers/sent': { page: '/account/offers/sent' },
          '/market': { page: '/market' },
          '/mint': { page: '/mint' },
          '/terms': { page: '/terms' },
        }
    },
};