import React from 'react'
import axios from 'axios'
import { UserContext } from './UserContext'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

interface UserProviderProps{
  children: JSX.Element | JSX.Element[]
}

const UserProvider = (props: UserProviderProps) => {
  
  const handleLogin = async (username: string, password: string) => {
    const url = '/api-auth/login/'
    const data = { username: username, password: password }

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

  const handleRefreshToken = async () => {
    try {
      const result = await axios.post('/api-auth/refresh/', { refresh: localStorage.getItem('refreshToken') })

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
    try {
      const resultUsers = await axios.get('/api-auth/users/', {
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
    try {
      const resultGroups = await axios.get('/api-auth/groups', {
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
    try {
      const resultPermissions = await axios.get('/api-auth/permissions/', {
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
    try {
      const response = await axios.post(
        '/api-auth/delete/',
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
    const url = `/api-auth/users/${id}/`

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
    const url = '/api-auth/register/'

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
    const url = `/api-auth/change_password/`

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
    const url = `/api-auth/change_password/${data.id}/`

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
    const url = '/api-auth/groups/'

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
    const url = `/api-auth/groups/${id}/`

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
    const url = `/api-auth/groups/${id}/`

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
