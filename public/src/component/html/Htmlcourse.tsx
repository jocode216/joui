import React from 'react'
import Introduction from './intro/Introduction'
import SingleHtml from '../blog/SingleHtml'
import Element from './element/Element'
import Basictags from './basictags/Basictags'
import BasicAttributes from './attributes/BasicAtributes'
import Musthtml from './musthtml/Musthtml'

function Htmlcourse() {
  return (
    <div>
      <SingleHtml />
      <Introduction />
      <Element />
      <Basictags />
      <BasicAttributes />
      <Musthtml />
    </div>
  )
}

export default Htmlcourse
