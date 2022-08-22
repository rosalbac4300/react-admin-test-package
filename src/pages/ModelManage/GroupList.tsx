import React, { useRef, useContext, useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Card, ListContainer, ListTableContainer } from '../../common'
import { UserContext } from '../../context'

interface GroupListProps {
    setLastAction (text: string): void,
    setActionSuccessMessage (open: boolean): void 
}

const GroupList = (props: GroupListProps) => {
  const actions = useRef<any>()
  const { getGroups, deleteGroup, listIncludesPermission } = useContext(UserContext)
  const [numberOfCheckedRows, setNumberOfCheckedRows] = useState(0)
  const [tableRows, setTableRows] = useState<any[]>([])
  const [allRowsSelected, setAllRowsSelected] = useState(false)

  const getTableRows = (groups: any[]) => {
    if (groups === null) {
      return 0
    }

    const rows = groups.map((group: any) => {
      const row = {
        ...group,
        checked: false
      }

      return row
    })

    setTableRows(rows)
  }

  useEffect(() => {
    getGroups().then((response: any) => {
      getTableRows(response)
    })
  }, [])

  const deleteRows = async () => {
    tableRows.map((row) => {
      if (row.checked) {
        deleteGroup(row.pk).then((data: any) => {
          getGroups().then((response: any) => {
            getTableRows(response)
          })
        })
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

        props.setLastAction(`Successfully deleted ${numberOfCheckedRows} ${numberOfCheckedRows !== 1 ? 'groups' : 'group'}.`)

        setNumberOfCheckedRows(0)

        break
      default:
        break
    }
  }

  const handleHeaderCheckClick = () => {
    const rows = tableRows
    const selected = allRowsSelected

    rows.forEach((row) => {
      row.checked = !selected
    })

    setAllRowsSelected(!selected)
    setTableRows(rows)
    setNumberOfCheckedRows(!selected ? rows.length : 0)
  }

  const handleRowCheckClick = useCallback((index: number) => {
    setTableRows((rows) => {
      return rows.map((row, i) => {
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
          <p> Select Group to change </p>
        </div>
        {tableRows !== null && (
          <div className="card-body">
            <div className="row divide">
              <div className="col-8 col-sm-12">
                <select className="text-field" ref={actions}>
                  <option value="">-----------</option>
                  {listIncludesPermission('auth', 'group', 'delete') && (
                    <option value="delete">Delete selected groups</option>
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
                {listIncludesPermission('auth', 'group', 'add') && (
                  <Link to={`add`}>
                    <Button inline={false} primary={false} bgColor="#469408">
                      <i className="fa-solid fa-circle-plus"></i>
                      <span> Add Group </span>
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
                      <span>Group</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((data, i) => {
                    return (
                      <tr className="data" key={data.pk}>
                        <td className="checkbox">
                          <input type="checkbox" checked={data.checked} onChange={() => handleRowCheckClick(i)} />
                        </td>
                        <td className="column">
                          <Link to={`${data.pk}/change`}> {data.name} </Link>
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

GroupList.propTypes = {
  setLastAction: PropTypes.func.isRequired,
  setActionSuccessMessage: PropTypes.func.isRequired
}

export default GroupList
