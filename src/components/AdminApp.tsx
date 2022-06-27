import React from 'react'
import PropTypes from 'prop-types'

const AdminApp = (prop: {dataProviderURL: string, appName: string, children: Array<object>}) => {
  
  return (
    <div>App</div>
  )
}

AdminApp.propTypes = {
  dataProviderURL: PropTypes.string.isRequired,
  appName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default AdminApp