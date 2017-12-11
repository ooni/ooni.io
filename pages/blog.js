import Head from '../components/Head'
import Layout from '../components/Layout'
import Markdown from '../components/Markdown'

import { Heading } from 'ooni-components'

import { createContentfulClient } from '../utils/contentful'

export default class extends React.Component {
  static async getInitialProps({ req, query}) {
    const contentfulClient = createContentfulClient()
    const entry = await contentfulClient.getEntry(query.id)
    return {
      title: entry.fields.title,
      content: entry.fields.content
    }
  }

  render() {
    const {
      title,
      content
    } = this.props
    return (
      <Layout>
        <Head title="Blog" />
        <Heading h={1}>Hello world!</Heading>
        <Markdown>{content}</Markdown>
      </Layout>
    )
  }
}
