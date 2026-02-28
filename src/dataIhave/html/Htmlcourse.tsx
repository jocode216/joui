import React from 'react'
import Introduction from './intro/Introduction'
import SingleHtml from '../blog/SingleHtml'
import Element from './element/Element'
import Basictags from './basictags/Basictags'
import BasicAttributes from './attributes/BasicAtributes'
import Musthtml from './musthtml/Musthtml'
import PublicHeader from '@/components/layout/PublicHeader'
import Footer from '../footer/Footer'

function Htmlcourse() {
  return (
    <div>
      <PublicHeader />
      <SingleHtml />
      <Introduction />
      <Element />
      <Basictags />
      <BasicAttributes />
      <Musthtml />
      <Footer />
    </div>
  )
}

export default Htmlcourse
