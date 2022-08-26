import React, { useContext, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useParams, useNavigate } from 'react-router-dom'
import { UserContext } from '../../context'
import { ListContainer, Card, Button, ErrorMessage, TextInput, SelectionInput, FormField } from '../../common'

interface GroupFormProps {
  change?: boolean
  setLastAction(message: string): void,
  setNextAction(message: string): void,
  setActionSuccessMessage(on: boolean): void
}

const GroupForm = ({setActionSuccessMessage, setLastAction, setNextAction, change = false} : GroupFormProps) => {
  const { id } = useParams()

  const { getGroups, getPermissions, addGroup, modifyGroup, deleteGroup, listIncludesPermission, handleLogout, handleRefreshToken } =
    useContext(UserContext)

  const [availablePermissions, setAvailablePermissions] = useState<any>(null)
  const [chosenPermissions, setChosenPermissions] = useState<any>(null)

  const [group, setGroup] = useState({
    display_name: '',
    name: '',
    permissions: []
  })
  const [error, setError] = useState(false)
  const [nameError, setNameError] = useState('')

  const [userCanAdd, setUserCanAdd] = useState(false)
  const [userCanView, setUserCanView] = useState(false)
  const [userCanChange, setUserCanChange] = useState(false)
  const [userCanDelete, setUserCanDelete] = useState(false)

  const getUsersPermissions = useCallback(() => {
    setUserCanAdd(listIncludesPermission('auth', 'group', 'add'))
    setUserCanChange(listIncludesPermission('auth', 'group', 'change'))
    setUserCanDelete(listIncludesPermission('auth', 'group', 'delete'))
    setUserCanView(listIncludesPermission('auth', 'group', 'view'))
  }, [])

  const navigate = useNavigate()

  const setPermissions = async () => {
    const response = await getPermissions()
    if(response.status === 200){
      if (change){
        const availPermissions = response.data.filter((permission: any) => !group.permissions.includes(permission.pk))
        const chPermissions = response.data.filter((permission: any) => group.permissions.includes(permission.pk))

        setAvailablePermissions(availPermissions)
        setChosenPermissions(chPermissions)
      } else {
        setAvailablePermissions(response.data)
        setChosenPermissions([])
      }
    } else if (response.status === 401){
      const refresh = await handleRefreshToken()
      if (refresh) {
        setPermissions()
      } else {
        handleLogout()
      }
    }
  }

  const getGroupList: any = async () => {
    const response = await getGroups()
    if (response.status === 200){
      return response.data
    } else if (response.status === 401) {
      const refresh = await handleRefreshToken()
      if (refresh){
        const data = await getGroupList()
        return data
      } else {
        handleLogout()
      }
    }
  }

  const getGroup = async () => {
    if (change) {
      const groupList = await getGroupList()
      var group = groupList.find((group: any) => {
          if (group.pk.toString() === id) {
            return group
          }
      })

        const currentGroup = {
          display_name: group.display_name,
          name: group.name,
          permissions: group.permissions
        }

        setGroup(currentGroup)
      } else {
      const currentGroup = {
        display_name: '',
        name: '',
        permissions: []
      }
      setGroup(currentGroup)
    }
  }

  const handleInputChange = useCallback((text: string, attribute: string) => {
    setGroup((value) => {
      const newGroup = {
        ...value,
        [attribute]: text
      }

      return newGroup
    })
  }, [])

  useEffect(() => {
    getGroup()
    getUsersPermissions()
  }, [change])

  useEffect(() => {
    setPermissions()
  }, [group])

  const handleSave:any = async () => {
    const newPermissions = chosenPermissions.map((option: any) => option.pk)

    const groupData = {
      name: group.name,
      permissions: newPermissions
    }

    if (change) {
      if(id !== undefined) {
        const result = await modifyGroup(groupData, id)
  
        if (result.status === 200 || result.status === 201) {
          setError(false)
          setNameError('')
          setLastAction(`The group ${result.data.display_name} was updated successfully.`)
          setActionSuccessMessage(true)
          return result
        } else if (result.status === 401) {
          const refresh = await handleRefreshToken()
          if (refresh) {
            const data = await handleSave()
            return data
          } else {
            handleLogout()
          }
        } else {
          setError(true)
          if (result.data.name) {
            setNameError(result.data.name)
          }
          return 'ERROR'
        }
      }
    } else {
      const result = await addGroup(groupData)

      if (result.status === 201 || result.status === 200) {
        setError(false)
        setNameError('')
        setLastAction(`The group ${result.data.display_name} was added successfully.`)
        setActionSuccessMessage(true)
        return result
      } else if (result.status === 401) {
        const refresh = await handleRefreshToken()
          if (refresh) {
            const data = await handleSave()
            return data
          } else {
            handleLogout()
          }
      } else {
        setError(true)
        if (result.data.name) {
          setNameError(result.data.name)
        }
        return 'ERROR'
      }
    }
  }

  const onSave = async () => {
    const saveStatus = await handleSave()

    if (saveStatus !== 'ERROR') {
      setNextAction('')

      if (userCanView || userCanChange) {
        navigate('/auth/groups/')
      } else {
        navigate('/')
      }
    }
  }

  const onDelete = async () => {
    if (id !== undefined) {
      const deleteStatus = await deleteGroup(id)
  
      if (deleteStatus.status === 204) {
        setError(false)
        setNameError('')
        setActionSuccessMessage(true)
        setLastAction(`The group ${group.display_name} was deleted successfully.`)
        setNextAction('')
        navigate('/auth/groups/')
      } else if (deleteStatus.status === 401) {
        const refresh = await handleRefreshToken()
          if (refresh) {
            onDelete()
          } else {
            handleLogout()
          }
      }
    }
  }

  const onSaveAndAdd = async () => {
    const saveStatus = await handleSave()

    if (saveStatus !== 'ERROR') {
      setNextAction('You may add add another group below.')
      change = false
      navigate('/auth/groups/add')
      getGroup()
    }
  }

  const onSaveAndContine = async () => {
    const saveStatus = await handleSave()

    if (saveStatus !== 'ERROR') {
      setNextAction('You may continue editing it below.')
      navigate(`/auth/groups/${saveStatus.data.pk}/change`)
    }
  }

  const onclose = () => {
    navigate(`/auth/groups`)
  }

  return (
    group !== null ? (
      <ListContainer>
        {error && <ErrorMessage />}
        <form className="col-12">
          <div className="row">
            <div className="col-lg-9 col-sm-12 col-md-12">
              <Card>
                <div className="card-header">
                  {change ? (userCanChange ? 'Change' : 'View') : userCanAdd ? 'Add' : 'View'} Group
                </div>
                <div className="card-body">
                  <TextInput
                    editable={(change && userCanChange) || (!change && userCanAdd)}
                    label="Name"
                    value={group.name}
                    onChange={handleInputChange}
                    attribute="name"
                  />
                  <FormField>
                    {nameError && (
                      <ul className="error-message">
                        <li> {nameError} </li>
                      </ul>
                    )}
                  </FormField>
                  {(availablePermissions !== null) && (chosenPermissions !== null) && (
                    <SelectionInput
                      editable={(change && userCanChange) || (!change && userCanAdd)}
                      available={availablePermissions}
                      chosen={chosenPermissions}
                      setChosen={setChosenPermissions}
                      setAvailable={setAvailablePermissions}
                      selectionName="permissions"
                    />
                  )}
                </div>
              </Card>
            </div>
            <div className="col-md-12 col-sm-12 col-lg-3">
              <Card>
                <div className="card-header">
                  <i className="fas fa-edit"></i>
                  <span>Actions</span>
                </div>
                <div className="card-body">
                  {((change && userCanChange) || (!change && userCanAdd)) && (
                    <Button bgColor="#469408" onClick={onSave} type="button">
                      Save
                    </Button>
                  )}
                  {change && userCanDelete && (
                    <Button bgColor="darkorchid" onClick={onDelete} type="button">
                      Delete
                    </Button>
                  )}
                  {change && !userCanChange && (
                    <Button bgColor="darkorchid" onClick={onclose} type="button">
                      Close
                    </Button>
                  )}
                  {userCanChange && userCanAdd && (
                    <Button bgColor="#029acf" onClick={onSaveAndAdd} type="button">
                      Save and add another
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
    ) : <></>
  )
}

GroupForm.proptypes = {
  chosen: PropTypes.bool,
  setLastAction: PropTypes.func.isRequired,
  setNextAction: PropTypes.func.isRequired,
  setActionSuccessMessage: PropTypes.func.isRequired
}

export default GroupForm
