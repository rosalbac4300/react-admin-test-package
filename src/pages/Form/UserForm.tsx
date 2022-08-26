import React, { useContext, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { UserContext } from '../../context'
import { ListContainer, Card, Button, ErrorMessage, TextInput, SelectionInput, FormField, EmailInput } from '../../common'
import { validateEmailInput, validateInput } from '../../helpers/validateForm'

interface UserFormProps {
  setLastAction(message: string): void,
  setNextAction(message: string): void,
  setActionSuccessMessage(on: boolean): void
}

const UserForm = ({setActionSuccessMessage, setLastAction, setNextAction}: UserFormProps) => {
  const { id } = useParams()

  const { deleteUser, modifyUser, getUsers, getGroups, getPermissions, listIncludesPermission, handleLogout, handleRefreshToken } =
    useContext(UserContext)

  const navigate = useNavigate()

  const [userData, setUserData] = useState<any>(null)
  const [availablePermissions, setAvailablePermissions] = useState([])
  const [chosenPermissions, setChosenPermissions] = useState([])

  const [availableGroups, setAvailableGroups] = useState([])
  const [chosenGroups, setChosenGroups] = useState([])

  const [password, setPassword] = useState({
    algorithm: '',
    iterations: '',
    salt: '',
    hash: ''
  })
  const [actionErrorMessage, setActionErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [userCanAdd, setUserCanAdd] = useState(false)
  const [userCanView, setUserCanView] = useState(false)
  const [userCanChange, setUserCanChange] = useState(false)
  const [userCanDelete, setUserCanDelete] = useState(false)

  const getUsersPermissions = useCallback(() => {
    setUserCanAdd(listIncludesPermission('backend', 'customuser', 'add'))
    setUserCanChange(listIncludesPermission('backend', 'customuser', 'change'))
    setUserCanDelete(listIncludesPermission('backend', 'customuser', 'delete'))
    setUserCanView(listIncludesPermission('backend', 'customuser', 'view'))
  }, [])

  const dividePassword = (user: any) => {
    if (user.password) {
      const strings = user.password.split('$')

      const password = {
        algorithm: strings[0],
        iterations: strings[1],
        salt: strings[2].slice(0, -(strings[2].length - 6)) + Array(strings[2].length - 5).join('*'),
        hash: strings[3].slice(0, -(strings[3].length - 6)) + Array(strings[3].length - 5).join('*')
      }

      setPassword(password)
    }
  }

  const getUserList: any = async () => {
    const response = await getUsers()

    if (response.status === 200) {
      return response.data
    } else if (response.status === 401) {
      const refresh = await handleRefreshToken()
      if (refresh) {
        const data = getUserList()
        return data
      } else {
        handleLogout()
      }
    } else {
      return false
    }
  }

  const getGroupList: any = async () => {
    const response = await getGroups()

    if (response.status === 200) {
      return response.data
    } else if (response.status === 401) {
      const refresh = await handleRefreshToken()
      if (refresh) {
        const data = getGroupList()
        return data
      } else {
        handleLogout()
      }
    } else {
      return false
    }
  }

  const getPermissionList: any = async () => {
    const response = await getPermissions()

    if (response.status === 200) {
      return response.data
    } else if (response.status === 401) {
      const refresh = await handleRefreshToken()
      if (refresh) {
        const data = getPermissionList()
        return data
      } else {
        handleLogout()
      }
    } else {
      return false
    }
  }

  const getUser = async () => {
    const users = await getUserList()

    if (users) {
      const user = users.find((user: any) => user.pk.toString() === id)
      console.log(users)
      console.log(user)

      if (user !== undefined) {
        dividePassword(user)
        setUserData(user)
        
        const groups = await getGroupList()

        if (groups) {
          const allGroups = groups
          const userGroups = user.groups

          const availGroups = allGroups.filter((permission: any) => {
            return !userGroups.includes(permission.pk)
          })
  
          const chGroups = allGroups.filter((permission: any) => {
            return userGroups.includes(permission.pk)
          })

          setAvailableGroups(availGroups)
          setChosenGroups(chGroups)
        }
      
        const permissions = await getPermissionList()

        if (permissions) {
          const availPermissions = permissions.filter((permission: any) => {
            return !user.user_permissions.includes(permission.pk)
          })

          const chPermissions = permissions.filter((permission: any) => {
            return user.user_permissions.includes(permission.pk)
          })

          setAvailablePermissions(availPermissions)
          setChosenPermissions(chPermissions)
        }

      }
    }
  }

  useEffect(() => {
    getUser()
    getUsersPermissions()
  }, [id])

  const handleInputChange = (value: string, attribute: string) => {
    const newUserData = {
      ...userData,
      [attribute]: value
    }

    setUserData(newUserData)
  }

  const handleCheckChange = (attribute: string) => {
    setUserData((value: any) => {
      const attrValue = value[attribute]

      return {
        ...value,
        [attribute]: !attrValue
      }
    })
  }

  const handleSave: any = async () => {
    const newPermissions = chosenPermissions.map((option: any) => option.pk)
    const newGroups = chosenGroups.map((option: any) => option.pk)

    const newUserData = {
      ...userData,
      groups: newGroups,
      user_permissions: newPermissions
    }

    if(id !== undefined){
      const answer = await modifyUser(newUserData, id)

      if (answer.status  === 200) {
        setLastAction(`The user ${userData.display_name} was updated successfully.`)
        setActionSuccessMessage(true)
        setActionErrorMessage(false)
        return true
      } else if (answer.status === 401) {
        const refresh = await handleRefreshToken()
        if (refresh) {
          const data = handleSave()
          return data
        } else {
          handleLogout()
        }
      } else {
        setActionErrorMessage(true)
        return false
      }
    }
  }

  const validateData = () => {
    var validData = true
    validData = validData && validateInput(userData.username) && validateEmailInput(userData.email)

    setActionErrorMessage(!validData)
    return validData
  }

  const onSave = async () => {
    if (!validateData()) {
      return setActionErrorMessage(true)
    } else {
      const response = await handleSave()

      if (response) {
        if (userCanView) {
          navigate(`/auth/users`)
        } else {
          navigate('/')
        }
      }
    }
  }

  const onDelete = async () => {
    if(id !== undefined) {
      const response = await deleteUser(id)
  
      if (response.status === 200 ) {
        setActionSuccessMessage(true)
        setActionErrorMessage(false)
        setErrorMessage('')
        setLastAction(`The user ${userData.display_name} was deleted successfully.`)
        navigate('/auth/users/')
      } else if (response.status === 401) {
        const refresh = await handleRefreshToken()
        if (refresh) {
          onDelete()
        } else {
          handleLogout()
        }
      } else {
        setActionErrorMessage(true)
        setErrorMessage('Could not delete user.')
      }
    }
  }

  const onSaveAndAdd = async () => {
    if (!validateData()) {
      return setActionErrorMessage(true)
    } else {
      const response = await handleSave()

      if (response) {
        setNextAction('You may add another user below.')
        navigate('/auth/users/add')
      }
    }
  }

  const onSaveAndContine = async () => {
    if (!validateData()) {
      return setActionErrorMessage(true)
    } else {
      const response = await handleSave()

      if (response) {
        setActionSuccessMessage(true)
        setNextAction('You may continue editing below.')
      }
    }
  }

  const onclose = () => {
    navigate('/auth/users')
  }

  const handleSubmit = useCallback((e: any) => {
    e.preventDefault()
  }, [])

  return (
    <ListContainer>
      {actionErrorMessage && 
        ( errorMessage === '' ? <ErrorMessage /> : <ErrorMessage message={errorMessage} />) }
      <form className="col-12" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-9 col-sm-12 col-md-12">
            <Card>
              <div className="card-header"> Change user </div>
              {userData !== null && (
                <div className="card-body">
                  <Card noColouredBorder>
                    <div className="card-body">
                      <TextInput
                        editable={userCanChange}
                        value={userData.username}
                        label="Username"
                        attribute="username"
                        onChange={handleInputChange}
                        error={actionErrorMessage}
                        message="Required. 150 characters or fewer. Letters, digit and @/./+/-/_ only."
                      />
                      {password && (
                        <FormField>
                          <div className="col-lg-3 col-sm-2">
                            <span className="label"> Password </span>
                          </div>
                          <div className="col-lg-9 col-sm-10">
                            <strong>algorithm</strong>:{password.algorithm} <strong>iterations</strong>:
                            {password.iterations} <strong>salt</strong>: {password.salt} {''}
                            <strong>hash</strong>: {password.hash}
                          </div>
                          <div className="col-12">
                            {userCanChange && (
                              <p className="input-message">
                                Raw passwords are not stored, so there's no way to see this users password, but you can
                                change the password using {''}
                                <Link className="input-message" to={`/auth/users/${id}/password`}>
                                  this form.
                                </Link>
                              </p>
                            )}
                          </div>
                        </FormField>
                      )}
                    </div>
                  </Card>
                  <Card noColouredBorder>
                    <div className="card-header"> Personal Info </div>
                    <div className="card-body">
                      <EmailInput
                        editable={userCanChange}
                        value={userData.email}
                        label="Email"
                        attribute="email"
                        onChange={handleInputChange}
                        error={actionErrorMessage}
                      />
                    </div>
                  </Card>
                  <Card noColouredBorder>
                    <div className="card-header"> Permissions </div>
                    <div className="card-body">
                      <FormField>
                        <div className="col-lg-3 col-sm-2">
                          <span className="label"> Active </span>
                        </div>
                        <div className="col-lg-9 col-sm-10">
                          {userCanChange ? (
                            <input
                              type="checkbox"
                              checked={userData.is_active}
                              onChange={() => handleCheckChange('is_active')}
                            ></input>
                          ) : userData.is_active ? (
                            <span style={{ color: 'green' }}>
                              <i className="fa-solid fa-circle-check"></i>
                            </span>
                          ) : (
                            <span style={{ color: 'crimson' }}>
                              <i className="fa-solid fa-circle-xmark"></i>
                            </span>
                          )}
                        </div>
                        <div className="col-12">
                          <p className="input-message">
                            Designates wether this user should be treated as active. Unselect this instead of deleting
                            accounts.
                          </p>
                        </div>
                      </FormField>
                      <FormField>
                        <div className="col-lg-3 col-sm-2">
                          <span className="label"> Staff Status </span>
                        </div>
                        <div className="col-lg-9 col-sm-10">
                          {userCanChange ? (
                            <input
                              type="checkbox"
                              checked={userData.is_staff}
                              onChange={() => handleCheckChange('is_staff')}
                            ></input>
                          ) : userData.is_staff ? (
                            <span style={{ color: 'green' }}>
                              <i className="fa-solid fa-circle-check"></i>
                            </span>
                          ) : (
                            <span style={{ color: 'crimson' }}>
                              <i className="fa-solid fa-circle-xmark"></i>
                            </span>
                          )}
                        </div>
                        <div className="col-12">
                          <p className="input-message">Designates whether the user can log into this admin site.</p>
                        </div>
                      </FormField>
                      <FormField>
                        <div className="col-lg-3 col-sm-2">
                          <span className="label"> Superuser Status </span>
                        </div>
                        <div className="col-lg-9 col-sm-10">
                          {userCanChange ? (
                            <input
                              type="checkbox"
                              checked={userData.is_superuser}
                              onChange={() => handleCheckChange('is_superuser')}
                            ></input>
                          ) : userData.is_superuser ? (
                            <span style={{ color: 'green' }}>
                              <i className="fa-solid fa-circle-check"></i>
                            </span>
                          ) : (
                            <span style={{ color: 'crimson' }}>
                              <i className="fa-solid fa-circle-xmark"></i>
                            </span>
                          )}
                        </div>
                        <div className="col-12">
                          <p className="input-message">
                            Designates that this user has all permissions without explicitly assigning them.
                          </p>
                        </div>
                      </FormField>
                      <SelectionInput
                        editable={userCanChange}
                        chosen={chosenGroups}
                        available={availableGroups}
                        setChosen={setChosenGroups}
                        setAvailable={setAvailableGroups}
                        selectionName={'groups'}
                      />
                      <SelectionInput
                        editable={userCanChange}
                        chosen={chosenPermissions}
                        available={availablePermissions}
                        setChosen={setChosenPermissions}
                        setAvailable={setAvailablePermissions}
                        selectionName={'user permissions'}
                      />
                    </div>
                  </Card>
                </div>
              )}
            </Card>
          </div>
          <div className="col-md-12 col-sm-12 col-lg-3">
            <Card>
              <div className="card-header">
                <i className="fas fa-edit"></i>
                <span>Actions</span>
              </div>
              <div className="card-body">
                {userCanChange && (
                  <Button bgColor="#469408" onClick={onSave} type="button">
                    Save
                  </Button>
                )}
                {userCanDelete && (
                  <Button bgColor="darkorchid" onClick={onDelete} type="button">
                    Delete
                  </Button>
                )}
                {userCanAdd && (
                  <Button bgColor="#029acf" onClick={onSaveAndAdd} type="button">
                    Save and add another
                  </Button>
                )}
                {!userCanAdd && !userCanChange && (
                  <Button bgColor="darkorchid" onClick={onclose} type="button">
                    Close
                  </Button>
                )}
                {userCanChange && (
                  <Button bgColor="#029acf" onClick={onSaveAndContine} type="button">
                    Save and continue editing
                  </Button>
                )}
              </div>
            </Card>
            <div className="row">
              <Button className="col-12" bgColor="silver" type="button">
                History
              </Button>
            </div>
          </div>
        </div>
      </form>
    </ListContainer>
  )
}

UserForm.propTypes = {
  setLastAction: PropTypes.func.isRequired,
  setNextAction: PropTypes.func.isRequired,
  setActionSuccessMessage: PropTypes.func.isRequired
}

export default UserForm