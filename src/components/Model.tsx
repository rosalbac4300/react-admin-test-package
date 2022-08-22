import React from 'react'
import PropTypes from 'prop-types'

const Model = (props: {
  modelName: string
  modelNamePlural?: string,
  apiURLName?: string  
}) => {
  return (<></>)
}

Model.propTypes = {
    modelName: PropTypes.string.isRequired,
    modelNamePlural: PropTypes.string,
    apiURLName: PropTypes.string
}

export default Model