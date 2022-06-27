import React from 'react'
import PropTypes from 'prop-types'

//Puedo tomar>  
// - ModelName
// - ModelNamePlural (que si no esta solamente le agrego una s al final como hce django)
// - apiURLname que seria lo que pondriamos en la url

const Model = (props: {modelName: string}) => {
  return (<></>)
}

Model.propTypes = {
    modelName: PropTypes.string.isRequired
}

export default Model