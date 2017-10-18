const path = require(`path`)

const _ = require(`lodash`)
const Promise = require(`any-promise`)
const slash = require(`slash`)
const { getBlogPostPath } = require(`./src/utils/paths`)

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage, createRedirect } = boundActionCreators
  return new Promise((resolve, reject) => {
    // The “graphql” function allows us to run arbitrary
    // queries against the local Contentful graphql schema. Think of
    // it like the site has a built-in database constructed
    // from the fetched data that you can run queries against.
    graphql(
      `
        {
          allContentfulBlogPost(limit: 1000) {
            edges {
              node {
                id
                aliases
                title
                publicationDate
              }
            }
          }
        }
      `
    )
      .then(result => {
        if (result.errors) {
          reject(result.errors)
        }

        // Create Blog post pages
        const blogPostTemplate = path.resolve(`./src/templates/blog-post.js`)
        // We want to create a detailed page for each
        // blog post node. We'll just use the Contentful id for the slug.

        _.each(result.data.allContentfulBlogPost.edges, edge => {
          const path = getBlogPostPath(edge.node)

          /*
          _.each(edge.aliases, alias => {
            createRedirect({
              fromPath: alias,
              toPath: path,
              isPermanent: true,
            })
          })
          */

          // Gatsby uses Redux to manage its internal state.
          // Plugins and sites can use functions like "createPage"
          // to interact with Gatsby.
          createPage({
            // Each page is required to have a `path` as well
            // as a template component. The `context` is
            // optional but is often necessary so the template
            // can query data specific to each page.
            path: path,
            component: slash(blogPostTemplate),
            context: {
              id: edge.node.id
            },
          })
        })

        resolve()
      })
  })
}
