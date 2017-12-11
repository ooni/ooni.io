import Head from '../components/Head'
import Layout from '../components/Layout'

import { Heading } from 'ooni-components'

export default () => (
  <Layout>
    <Head title="Home" />
    <Heading h={1}>Hello world!</Heading>
  </Layout>
)
