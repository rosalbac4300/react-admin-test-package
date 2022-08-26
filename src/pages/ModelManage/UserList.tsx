import React, { useContext, useEffect, useState, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { Card, Button, ListContainer, ListTableContainer } from '../../common'
import { UserContext } from '../../context'

//TODO: make filters work

interface UserListProps {
    setLastAction (text: string): void,
    setActionSuccessMessage (open: boolean): void 
}

const UserList = (props: UserListProps) => {
  const actions = useRef<any>()
  const { getUsers, deleteUser, listIncludesPermission, handleRefreshToken, handleLogout } = useContext(UserContext)
  const [users, setUsers] = useState<any[]>([])
  const [numberOfCheckedRows, setNumberOfCheckedRows] = useState(0)
  const [tableRows, setTableRows] = useState<any[]>([])
  const [allRowsSelected, setAllRowsSelected] = useState(false)

  const getTableRows = () => {
    const rows = users.map((user: any) => {
      const row = {
        ...user,
        checked: false
      }

      return row
    })

    setTableRows(rows)
  }

  const getUserList = async () => {
    const response = await getUsers()

    if(response.status === 200) {
      setUsers(response.data)
    } else {
      if (response.status == 401) {
        const refresh = await handleRefreshToken()
          if (refresh) {
            getUserList()
          } else {
            handleLogout()
          }
      } 
    }
  }

  useEffect(() => {
    getUserList()
  }, [])

  useEffect(() => {
    if(users !== undefined){
      getTableRows()
    }
  }, [users])

  const deleteElement = async (id: string) => {
    const response = await deleteUser(id)
    if(response.status === 204) {
      getUserList()
    }
    if(response.status === 401) {
      const refresh = await handleRefreshToken()
      if (refresh) {
        deleteElement(id)
      } else {
        handleLogout()
      }
    }
  }

  const deleteRows = () => {
    tableRows.map((row: any) => {
      if (row.checked) {
        deleteElement(row.pk)
      }
    })
  }

  const handleActionClick = () => {
    const selectedIndex = actions.current.options.selectedIndex
    const optionValue = actions.current.options[selectedIndex].value

    switch (optionValue) {
      case 'delete':
        deleteRows()
        props.setActionSuccessMessage(true)
        props.setLastAction(`Successfully deleted ${numberOfCheckedRows} ${numberOfCheckedRows !== 1 ? 'users' : 'user'}.`)
        setNumberOfCheckedRows(0)
        break
      default:
        break
    }
  }

  const handleHeaderCheckClick = () => {
    const rows = tableRows
    const selected = allRowsSelected

    rows.forEach((row: any) => {
      row.checked = !selected
    })

    setAllRowsSelected(!selected)
    setTableRows(rows)
    setNumberOfCheckedRows(!selected ? rows.length : 0)
  }

  const handleRowCheckClick = useCallback((index: number) => {
    setTableRows((rows: any) => {
      return rows.map((row: any, i: number) => {
        if (i === index) {
          row = {
            ...row,
            checked: !row.checked
          }

          if (!row.checked) {
            setAllRowsSelected(false)
            setNumberOfCheckedRows((num) => num - 1)
          } else {
            setNumberOfCheckedRows((num) => num + 1)
          }
        }

        return row
      })
    })
  }, [])

  return (
    <ListContainer>
      <Card noColouredBorder={false} className="col-12">
        <div className="card-header">
          <p> Select User to change </p>
          <div className="filters row">
            <select className="text-field">
              <option value="no-selection"> Staff Status </option>
              <option value="">-----------</option>
              <option value="delete">Yes</option>
              <option value="delete">Yes</option>
            </select>
            <select className="text-field">
              <option value="no-selection"> Superuser Status </option>
              <option value="">-----------</option>
              <option value="delete">Yes</option>
              <option value="delete">Yes</option>
            </select>
            <select className="text-field">
              <option value="no-selection"> Active </option>
              <option value="">-----------</option>
              <option value="delete">Yes</option>
              <option value="delete">Yes</option>
            </select>
            <input className="text-field" />
            <Button inline={false} primary={false} bgColor="crimson" type="button">
              Search
            </Button>
          </div>
        </div>
        {tableRows.length !== 0 && (
          <div className="card-body">
            <div className="row divide">
              <div className="col-8 col-sm-12">
                <select className="text-field" ref={actions}>
                  <option value="">-----------</option>
                  {listIncludesPermission('backend', 'customuser', 'delete') && (
                    <option value="delete">Delete selected users</option>
                  )}
                </select>
                <Button inline={false} primary={false} bgColor="crimson" type="button" onClick={handleActionClick}>
                  Go
                </Button>
                <span>
                  {numberOfCheckedRows} out of {tableRows.length} selected
                </span>
              </div>
              <div className="col-4 col-sm-12 right">
                {listIncludesPermission('backend', 'customuser', 'add') && (
                  <Link to={`add`}>
                    <Button inline={false} primary={false} bgColor="#469408">
                      <FontAwesomeIcon icon={faCirclePlus} />
                      <span> Add User </span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <ListTableContainer>
              <table>
                <thead>
                  <tr className="header">
                    <th className="checkbox">
                      <input type="checkbox" checked={allRowsSelected} onChange={handleHeaderCheckClick} />
                    </th>
                    <th className="column">
                      <span>Username</span>
                    </th>
                    <th className="column">
                      <span>Email</span>
                    </th>
                    <th className="column">
                      <span className="center">Staff Status</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((data: any, i: number) => {
                    return (
                      <tr className="data" key={data.pk}>
                        <td className="checkbox">
                          <input type="checkbox" checked={data.checked} onChange={() => handleRowCheckClick(i)} />
                        </td>
                        <td className="column">
                          <Link to={`${data.pk}/change`}> {data.username} </Link>
                        </td>
                        <td className="">
                          <span> {data.email} </span>
                        </td>
                        <td className="column">
                          {data.is_staff ? (
                            <span className="center" style={{ color: 'green' }}>
                              <FontAwesomeIcon icon={faCircleCheck} />
                            </span>
                          ) : (
                            <span className="center" style={{ color: 'crimson' }}>
                              <FontAwesomeIcon icon={faCircleXmark} />
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </ListTableContainer>
          </div>
        )}
      </Card>
    </ListContainer>
  )
}

UserList.propTypes = {
  setLastAction: PropTypes.func.isRequired,
  setActionSuccessMessage: PropTypes.func.isRequired
}

export default UserList
