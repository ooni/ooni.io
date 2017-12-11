import React from 'react'
import styled from 'styled-components'
import ReactMarkdown from 'react-markdown'
import {
  Box,
  Heading,
  Link,
  Code,
  Pre,
  Image
} from 'ooni-components'

const MDCode = props => (
  <Code
    color='blue'
    children={props.literal}
  />
)

const MDHeading = props => {
  return (
    <Heading
      h={props.level}
      {...props}
      id={props.children}
      mt={5}
      mb={2}
    />
  )
}

const renderers = {
  Heading: MDHeading,
  Code: MDCode,
  Link
}

class Markdown extends React.Component {
  render () {
    return (
      <ReactMarkdown
        source={this.props.children}
        renderers={renderers}
      />
    )
  }
}

export default Markdown
