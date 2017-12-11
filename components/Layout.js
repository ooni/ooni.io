import React from 'react'

import Head from './Head'
import { Provider, theme } from 'ooni-components'

const Layout = props => (
  <div>
    <Head
      title={props.title}
      description={props.description}
      url={props.url}
      ogImage={props.ogImage}
    />
    <Provider theme={theme}>
      <div className='content'>
        { props.children }
      </div>
    </Provider>
  </div>
)
export default Layout
