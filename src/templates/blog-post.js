import React from "react"
import GLink from "gatsby-link"
import * as PropTypes from "prop-types"
import Img from "gatsby-image"

import {
  Heading,
  Text,
  Container,
  Input,
  Button,
  Link,
  Row,
  Column,
  Pre,
  Flex,
  Box,
} from 'ooni-components'

const propTypes = {
  data: PropTypes.object.isRequired,
}

class BlogPostTemplate extends React.Component {
  render() {
    const blogPost = this.props.data.contentfulBlogPost
    const {
      title,
      authors,
      publicationDate,
      coverImage,
      content
    } = blogPost
    return (
      <Container>
        <Heading h={1}>{title}</Heading>
        {coverImage && <Img resolutions={coverImage[0].resolutions} />}
        {authors.map((author) => (<div>{author}</div>))}
        <div>{publicationDate}</div>
        <div
            dangerouslySetInnerHTML={{
              __html: content.childMarkdownRemark.html,
            }}
          />
      </Container>
    )
  }
}

BlogPostTemplate.propTypes = propTypes

export default BlogPostTemplate

export const blogPostQuery = graphql`
  query blogPostQuery($id: String!) {
    contentfulBlogPost(id: { eq: $id }) {
      title
      content {
        childMarkdownRemark {
          html
        }
      }
      authors
      publicationDate
    }
  }
`
