module.exports = {
  webpack: (config) => {
    // Fixes npm packages that depend on `fs`, `net` and `tls` modules
    config.node = {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    }

    config.module.rules.push({
      test: /\.(eot|ttf|woff|woff2|otf)$/,
      use: [
        {
          loader: 'url-loader'
        }
      ]
    })

    return config
  },
  exportPathMap: () => ({
    "/": { page: "/" }
  })

}
