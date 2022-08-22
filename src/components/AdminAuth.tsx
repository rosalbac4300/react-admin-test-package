// This component is used so that it is necesary to log in and have an user account. 

import React from 'react'

interface AdminAuthProps {
    refreshURL: string,
    loginURL: string,
    userProviderURL: string ,
    groupsProviderURL?: string,
    permissionsURL: string,
    deleteUser: string
}

const AdminAuth = (props: AdminAuthProps) => {
  return <></>
}

export default AdminAuth