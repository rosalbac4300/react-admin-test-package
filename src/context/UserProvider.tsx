import React, { useState } from 'react'
import axios from 'axios'
import { UserContext } from './UserContext'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

//TODO: improve this link thing, there's too many links for user !!!

interface UserProviderProps{
  children: JSX.Element | JSX.Element[],
  refreshURL: string,
  loginURL: string,
  userProviderURL: string, 
  groupsProviderURL: string,
  permissionsURL: string,
  deleteUser: string,
  registerUser: string,
  changePassword: string
}

const UserProvider = (props: UserProviderProps) => {
  const handleLogin = async (username: string, password: string) => {
    const data = { username: username, password: password }
    var url

    if(props.loginURL.slice(-1) !== '/'){
      url = props.loginURL + '/'
    } else {
      url = props.loginURL
    }

    try {
      const result = await axios.post(url, data)

      if (result.status === 200) {
        const user = {
          id: result.data.user.pk,
          email: result.data.user.email,
          username: data.username,
          is_active: result.data.user.is_active,
          is_superuser: result.data.user.is_superuser,
          permissions: result.data.user.all_permissions
        }

        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('access', result.data.access)
        localStorage.setItem('refreshToken', result.data.refresh)

        return result
      }
    } catch (error: any) {
      return error.response
    }
  }

  //ERROR saying handleRefreshToken is not a function 
  const handleRefreshToken = async () => {  
    var url

    if(props.refreshURL.slice(-1) !== '/'){
      url = props.refreshURL + '/'
    } else {
      url = props.refreshURL
    }

    try {   
      const result = await axios.post(url, { refresh: localStorage.getItem('refreshToken') })

      if (result.status === 200) {
        const refresh = localStorage.getItem('refreshToken')
        const user = localStorage.getItem('user')
        localStorage.setItem('access', result.data.access)
        localStorage.setItem('refreshToken', refresh || '')
        localStorage.setItem('user', user || '')
      }

      return 200
    } catch (error) {
      return 400
    }
  } 

  const handleLogout = async () => {
    localStorage.clear()
    history.go(0)
  }

  const getUsers = async () => {
    var url

    if(props.userProviderURL.slice(-1) !== '/'){
      url = props.userProviderURL + '/'
    } else {
      url = props.userProviderURL
    }

    try {
      const resultUsers = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })

      return resultUsers.data
    } catch (error: any) {
      if (error.response.status == 401) {
        handleRefreshToken().then((refresh) => {
          if (refresh === 200) {
            getUsers()
          } else {
            if (window.location.pathname.split('/').pop() !== 'login') {
              handleLogout()
            }
          }
        })
      }
    }
  }

  const getGroups = async () => {
    var url

    if(props.groupsProviderURL.slice(-1) !== '/'){
      url = props.groupsProviderURL + '/'
    } else {
      url = props.groupsProviderURL
    }

    try {
      const resultGroups = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })

      return resultGroups.data
    } catch (error: any) {
      if (error.response.status == 401) {
        handleRefreshToken().then((refresh) => {
          if (refresh === 200) {
            getGroups()
          } else {
            if (window.location.pathname.split('/').pop() !== 'login') {
              handleLogout()
            }
          }
        })
      }
    }
  }

  const getPermissions = async () => {
    var url

    if(props.permissionsURL.slice(-1) !== '/'){
      url = props.permissionsURL + '/'
    } else {
      url = props.permissionsURL
    }

    try {
      const resultPermissions = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })

      return resultPermissions.data
    } catch (error: any) {
      if (error.response.status == 401) {
        handleRefreshToken().then((refresh) => {
          if (refresh === 200) {
            getPermissions()
          } else {
            if (window.location.pathname.split('/').pop() !== 'login') {
              handleLogout()
            }
          }
        })
      }
    }
  }

  const deleteUser = async (id: string) => {
    var url

    if(props.deleteUser.slice(-1) !== '/'){
      url = props.deleteUser + '/'
    } else {
      url = props.deleteUser
    }

    try {
      const response = await axios.post(
        url,
        { pk: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`
          }
        }
      )

      if (response.status !== 200 && response.status !== 204) {
        const message = 'Error with Status Code: ' + response.status
        throw new Error(message)
      }

      return 'OK'
    } catch (error: any) {
      if (error.response.status == 401) {
        handleRefreshToken().then((refresh) => {
          if (refresh === 200) {
            deleteUser(id)
          } else {
            handleLogout()
          }
        })
      }
    }
  }

  const modifyUser = async (data: object, id: string) => {
    var url

    if(props.userProviderURL.slice(-1) !== '/'){
      url = `${props.userProviderURL}/${id}/`
    } else {
      url = `${props.userProviderURL}${id}/`
    }

    try {
      const response = await axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`
        }
      })

      if (response.statusText !== 'OK') {
        const message = 'Error with Status Code: ' + response.status
        throw new Error(message)
      }

      return 'OK'
    } catch (error: any) {
      if (error.response.status == 401) {
        handleRefreshToken().then((refresh) => {
          if (refresh === 200) {
            modifyUser(data, id)
          } else {
            handleLogout()
          }
        })
      }
    }
  }

  const registerUser = async (data: object) => {
    var url

    if(props.registerUser.slice(-1) !== '/'){
      url = `${props.registerUser}/`
    } else {
      url = props.registerUser
    }

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`
        }
      })

      if (response.status !== 201) {
        const message = 'Error with Status Code: ' + response.status
        throw new Error(message)
      }

      return response
    } catch (error: any) {
      if (error.response.status == 401) {
        handleRefreshToken().then((refresh) => {
          if (refresh === 200) {
            registerUser(data)
          } else {
            handleLogout()
          }
        })
      }
    }
  }

  const updatePassword = async (data: object) => {
    var url

    if(props.changePassword.slice(-1) !== '/'){
      url = `${props.changePassword}/`
    } else {
      url = props.changePassword
    }

    try {
      const response = await axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`
        }
      })

      if (response.status !== 200) {
        const message = 'Error with Status Code: ' + response.status
        throw new Error(message)
      }

      return response
    } catch (error: any) {
      if (error.response.status == 401) {
        handleRefreshToken().then((refresh) => {
          if (refresh === 200) {
            updatePassword(data)
          } else {
            handleLogout()
          }
        })
      }
    }
  }

  //TODO: Hacer que pida data y url
  const updateUserPassword = async (data: any) => {
    var url

    if(props.changePassword.slice(-1) !== '/'){
      url = `${props.changePassword}/${data.id}`
    } else {
      url = `${props.changePassword}${data.id}`
    }

    try {
      const response = await axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`
        }
      })

      if (response.status !== 200) {
        const message = 'Error with Status Code: ' + response.status
        throw new Error(message)
      }

      return response
    } catch (error: any) {
      if (error.response.status == 401) {
        handleRefreshToken().then((refresh) => {
          if (refresh === 200) {
            updatePassword(data)
          } else {
            handleLogout()
          }
        })
      }
    }
  }

  const addGroup = async (data: object) => {
    var url

    if(props.groupsProviderURL.slice(-1) !== '/'){
      url = props.groupsProviderURL+'/'
    } else {
      url = props.groupsProviderURL
    }

    try {
      const response = await axios.post(url, data)

      if (response.status !== 201) {
        const message = 'Error with Status Code: ' + response.status
        throw new Error(message)
      }

      return response
    } catch (error: any) {
      return error.response
    }
  }

  const modifyGroup = async (data: object, id: string) => {
    var url

    if(props.groupsProviderURL.slice(-1) !== '/'){
      url = `${props.groupsProviderURL}/${id}/`
    } else {
      url = `${props.groupsProviderURL}${id}/`
    }

    try {
      const response = await axios.put(url, data)

      if (response.status !== 200) {
        const message = 'Error with Status Code: ' + response.status
        throw new Error(message)
      }

      return response
    } catch (error: any) {
      return error.response
    }
  }

  const deleteGroup = async (id: string) => {
    var url

    if(props.groupsProviderURL.slice(-1) !== '/'){
      url = `${props.groupsProviderURL}/${id}/`
    } else {
      url = `${props.groupsProviderURL}${id}/`
    }

    try {
      const response = await axios.delete(url)

      if (response.status !== 204) {
        const message = 'Error with Status Code: ' + response.status
        throw new Error(message)
      }

      return response
    } catch (error: any) {
      return error.response
    }
  }

  const listIncludesPermission = (app:string, model:string = '', action:string = '') => {
    var includesPermission = false
    const currentUserPermissionList = JSON.parse(localStorage.getItem('user') || '{}').permissions
    const length = currentUserPermissionList.length
    var i = 0

    while (!includesPermission && i < length) {
      if (model === '' && action === '') {
        i = 1 + i

        if (currentUserPermissionList[i - 1].includes(app)) {
          return true
        }
      } else {
        i = i + 1

        if (currentUserPermissionList[i - 1] === `${app}.${action}_${model}`) {
          return true
        }
      }
    }

    return includesPermission
  }

  return (
    <UserContext.Provider
      value={{
        handleLogin,
        handleLogout,
        handleRefreshToken,
        deleteUser,
        modifyUser,
        registerUser,
        updatePassword,
        updateUserPassword,
        addGroup,
        modifyGroup,
        deleteGroup,
        getUsers,
        getGroups,
        getPermissions,
        listIncludesPermission
      }}
    >
      {props.children}
    </UserContext.Provider>
  )
}

export default UserProvider
