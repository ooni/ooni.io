import React from 'react'

import Head from 'next/head'
import { Provider, theme } from 'ooni-components'

const Layout = props => (
  <div>
    <Head>
      <title>{props.title || 'OONI'}</title>
      <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
    </Head>
    <Provider theme={theme}>
      <div className='content'>
        { props.children }
      </div>
    </Provider>
  </div>
)
export default Layout
