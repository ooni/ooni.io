import React from 'react'
import GLink from 'gatsby-link'

import {
  Heading,
  Text,
  Container,
  Label,
  Input,
  Button,
  Link,
  Row,
  Column,
  Pre,
  RadioGroup,
  RadioButton,
  Flex,
  Box,
  InputWithIconButton,
  Modal,
  TwitterShareButton,
  Hero,
  HeroLead,
} from 'ooni-components'

const IndexPage = () => (
  <div>
  <Hero pb={4} pt={4}>
    <HeroLead>
    Welcome to OONI
    </HeroLead>
  </Hero>
  <Container>
    <Heading h={2}>Test Name</Heading>
    <Text>Ex, TLS handshake, DNS tampering irure ea, officia culpa quis blocking. Middlebox censorship dolore blocking incididunt traffic manipulation blocking in pariatur, traffic manipulation packet capture. Blocking in packet capture, cupidatat lorem network interference, laborum packet capture DNS tampering. Mollit ipsum fugiat, do surveillance ut surveillance network interference consequat surveillance internet surveillance veniam. Anim blocking dolor ut internet, TCP network interference surveillance cupidatat traffic manipulation magna. Ea sint nulla DNS tampering, ut incididunt sunt sint et TCP aliquip, id TCP deserunt. Dolore reprehenderit, connection reset traffic manipulation, ex sunt censorship minim, packet capture. Udp, sed, blocking surveillance officia DNS tampering blocking network interference, dolor. Commodo network interference, et officia aliquip internet network interference TLS handshake, traffic manipulation connection reset DNS tampering culpa est TLS handshake. Excepteur, TCP veniam labore, enim surveillance sint, ex qui, packet capture, labore ea adipisicing in blocking TLS handshake.</Text>
    <Link>
      <GLink to="/page-2/">Go to page 2</GLink>
    </Link>
  </Container>
  </div>
)

export default IndexPage
