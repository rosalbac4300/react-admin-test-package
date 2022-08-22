import React, { useCallback, useContext, useEffect, useState } from 'react'
import PropTypes, { any } from 'prop-types'
import { Link } from 'react-router-dom'
import { ListTableContainer } from '../../common'

interface ListTableProps {
  model: {
    modelName: string,
    modelNamePlural: string,
    apiURLName: string
  },
  modelsData: any[],
  modelsOptions: any, 
  tableRows: any[],
  setTableRows(rows: any[]): void, 
  numberOfCheckedRows: number, 
  setNumberOfCheckedRows(number: number): void
}

const ListTable = (props: ListTableProps) => {
  const [columnNames, setColumnNames] = useState<any[]>([])
  const [modelAttributes, setModelAttributes] = useState<any[]>([])
  const [allRowsSelected, setAllRowsSelected] = useState(false)

  const getColumnNamesAndTableRows = useCallback(() => {
    const attributes = Object.keys(props.modelsOptions.fields)
    const column: any[] = []
    const listAttributes: any[] = []
    const rows: any[] = []

    attributes.forEach((attr) => {
      if (props.modelsOptions.fields[attr].required) {
        column.push(props.modelsOptions.fields[attr].label)
        listAttributes.push(attr)
      }
    })

    props.modelsData.forEach((data) => {
     let dataElement = { checked: false, pk: data.pk }

      listAttributes.forEach((attr) => {
        dataElement = {
          ...dataElement,
          [attr]: data[attr]
        }
      })

      rows.push(dataElement)
    })

    props.setTableRows(rows)
    setColumnNames(column)
    setModelAttributes(listAttributes)
  }, [props.modelsOptions, props.model, props.modelsData])

  useEffect(() => {
    getColumnNamesAndTableRows()
  }, [getColumnNamesAndTableRows])

  const handleRowCheckClick = (index: any) => {
    const newRows = props.tableRows.map((row: any, i: number) => {
      if (i === index) {
        row = {
          ...row,
          checked: !row.checked
        }

        if (!row.checked) {
          setAllRowsSelected(false)
          const num = props.numberOfCheckedRows - 1
          props.setNumberOfCheckedRows(num)
        } else {
          const num = props.numberOfCheckedRows + 1
          props.setNumberOfCheckedRows(num)
        }
      }

      return row
    })
    props.setTableRows(newRows)
  }

  const handleHeaderCheckClick = () => {
    const rows = props.tableRows
    const selected = allRowsSelected

    rows.forEach((row: { checked: boolean }) => {
      row.checked = !selected
    })

    setAllRowsSelected(!selected)
    props.setTableRows(rows)
    props.setNumberOfCheckedRows(!selected ? rows.length : 0)
  }

  return (
    <ListTableContainer>
      <table>
        <thead>
          <tr className="header">
            <th className="checkbox">
              <input type="checkbox" checked={allRowsSelected} onChange={handleHeaderCheckClick} />
            </th>
            {columnNames.map((col) => {
              return (
                <th key={col} className="column">
                  <span>{col}</span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {props.tableRows.map((data: any, i: any) => {
            return (
              <tr className="data" key={data.pk}>
                <td className="checkbox">
                  <input type="checkbox" checked={data.checked} onChange={() => handleRowCheckClick(i)} />
                </td>
                {modelAttributes.map((attr: any) => {
                  return (
                    <td className="column" key={attr}>
                      <Link to={`${data.pk}/change`}>{data[attr]}</Link>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </ListTableContainer>
  )
}

ListTable.propTypes = {
  model: PropTypes.object.isRequired,
  modelsData: PropTypes.array.isRequired,
  modelsOptions: PropTypes.object.isRequired,
  tableRows: PropTypes.array.isRequired,
  setTableRows: PropTypes.func.isRequired,
  setNumberOfCheckedRows: PropTypes.func.isRequired
}

export default ListTable
