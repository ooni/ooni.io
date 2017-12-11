import { createClient } from 'contentful'
import paramCase from 'param-case'

export const CONTENTFUL_WEBSITE_SPACE_ID = 'brg7eld9zwg1'

export const CONTENTFUL_ACCESS_TOKEN = 'undefined' !== process ? process.env.CONTENTFUL_ACCESS_TOKEN : null

export const contentTypes = {
  blogPost: 'blogPost'
}

export const contentfulClient = createClient({
  space: CONTENTFUL_WEBSITE_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN
})

export const getAllBlogPosts = async (opt = {}) => {
  let entries,
    items = [],
    total = 1,
    skip = 0

  const order = opt.order || 'fields.publicationDate',
        limit = opt.limit || 100

  while (items.length < total) {
    entries = await contentfulClient.getEntries({
      content_type: contentTypes.blogPost,
      order,
      limit,
      skip
    })
    skip += entries.items.length
    items = items.concat(entries.items)
    total = entries.total
  }
  return items
}

export const getBlogPostsExportPathMap = async () => {
  const blogPostPathMap = (item) => {
    let path = item.fields.title
    if (item.fields.aliases) {
      path = item.fields.aliases[0]
    }
    path = paramCase(path)
    return [
      `/blog/${path}`,
      {
        page: "/blog",
        query: item.sys.id
      }
    ]
  }

  let items = await getAllBlogPosts()
  return items
    .map(blogPostPathMap)
    .reduce((acc, cv) => {
      if (acc[cv[0]] !== undefined) {
        throw Error('Duplicate key detected')
      }
      acc[cv[0]] = cv[1]
      return acc
    }, {})
}
