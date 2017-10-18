module.exports = {
  siteMetadata: {
    title: `OONI: Open Observatory of Network Interference`,
  },
  plugins: [
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: `brg7eld9zwg1`,
        accessToken: `4ab73635cc24c29dbf5295cc813d75d3f48b7dd47c5758807867df6984fe0d06`,
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-plugin-offline`
  ],
}
