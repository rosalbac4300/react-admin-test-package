import React, { useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { Link, useParams } from 'react-router-dom'
import { Card, Button, ListContainer, ErrorMessage } from '../../common'
import { DataContext, UserContext } from '../../context'
import ListTable from './ListTable'


interface ModelListProps {
  setLastAction(message: string): void,
  setActionSuccessMessage(message: boolean): void,
  model: {
    modelName: string,
    modelNamePlural: string,
    apiURLName: string
  },
  providerURL: string
}

const ModelList = (props: ModelListProps) => {
  const {app} = useParams()
  const actions = useRef<any>()
  const [numberOfCheckedRows, setNumberOfCheckedRows] = useState(0)
  const [modelsData, setModelsData] = useState<any[]>([])
  const [modelsOptions, setModelsOptions] = useState<any>({
    description: '',
    name: '',
    fields: {}
  })
  const [tableRows, setTableRows] = useState<any[]>([])
  const { getModelData, getModelOptions, deleteItem } = useContext(DataContext)
  const { listIncludesPermission, handleLogout, handleRefreshToken } = useContext(UserContext)
  
  const [actionErrorMessage, setActionErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const deleteElement = async (id: string) => {
    const response = await deleteItem(props.providerURL, props.model.apiURLName, id)
    
    if(response.status === 204) {
      getModelList()
      setActionErrorMessage(false)
      setErrorMessage('')
      setNumberOfCheckedRows((numberOfCheckedRows) => numberOfCheckedRows -1)
    } else if(response.status === 401) {
      const refresh = await handleRefreshToken()
      if (refresh) {
        deleteElement(id)
      } else {
        handleLogout()
      }
    } else {
      setActionErrorMessage(true)
      setErrorMessage("Couldn't delete items")
      props.setActionSuccessMessage(false)
    }
  }

  const deleteRows = () => {
    tableRows.map((row) => {
      if (row.checked && props.model !== undefined) {
        deleteElement(row.pk)
      }
    })

    if(!actionErrorMessage){
      props.setActionSuccessMessage(true)
      props.setLastAction(
        `Successfully deleted ${numberOfCheckedRows} ${numberOfCheckedRows !== 1 ? props.model.modelNamePlural : props.model.modelName}.`
      )
    }
  }

  const getModelList = async () => {
    const response = await getModelData(props.providerURL, props.model.apiURLName)

    if (response.status === 200){
      setModelsData(response.data)
    } else if (response.status === 401){
      const refresh = await handleRefreshToken()
      if (refresh) {
        getModelList()
      } else {
        handleLogout()
      }
    }
  }

  const getOptions = async () => {
    const response = await getModelOptions(props.providerURL, props.model.apiURLName)

    if (response.status === 200){
      setModelsOptions(response.data)
    } else if (response.status === 401){
      const refresh = await handleRefreshToken()
      if (refresh) {
        getOptions()
      } else {
        handleLogout()
      }
    }
  }

  useEffect(() => {
    getModelList()
    getOptions()
  }, [props.model.modelName])

  const handleActionClick = () => {
    const selectedIndex = actions.current.options.selectedIndex
    const optionValue = actions.current.options[selectedIndex].value

    switch (optionValue) {
      case 'delete':
        deleteRows()
        
        break
      default:
        break
    }
  }

  return (
      <ListContainer>
        {actionErrorMessage && 
        (errorMessage === '' ? <ErrorMessage /> : <ErrorMessage message={errorMessage}/>)}
        <Card noColouredBorder = { false } className="col-12">
          <div className="card-header"> Select {props.model.modelName} to change </div>
          {modelsData !== undefined && modelsOptions !== undefined && (<div className="card-body">
            <div className="row divide">
              <div className="col-8 col-sm-12">
                <select className="text-field" ref={actions}>
                  <option value="">-----------</option>
                  {app !== undefined ? listIncludesPermission(app, props.model.modelName, 'delete') && (
                    <option value="delete">Delete selected {props.model.modelName}</option>
                  ): <></>}
                </select>
                <Button 
                  inline={false}
                  primary={false}
                  bgColor="crimson" 
                  type="button" 
                  onClick={handleActionClick}>
                  Go
                </Button>
                <span>
                  {numberOfCheckedRows} out of {modelsData.length} selected
                </span>
              </div>
              <div className="col-4 col-sm-12 right">
                {app !== undefined ? listIncludesPermission(app, props.model.modelName, 'add') && (
                  <Link to={`add`}>
                    <Button 
                      bgColor="#469408"
                      inline={false}
                      primary={false}
                    >
                      <span className="icon-green">
                        <FontAwesomeIcon icon={faCirclePlus} />
                      </span>
                      <span> Add {props.model.modelName} </span>
                    </Button>
                  </Link>
                ):<></>}
              </div>
            </div>
            <ListTable
              model={props.model}
              modelsData={modelsData}
              modelsOptions={modelsOptions}
              tableRows={tableRows}
              setTableRows={setTableRows}
              numberOfCheckedRows={numberOfCheckedRows}
              setNumberOfCheckedRows={setNumberOfCheckedRows}
            />
            <div>
              {modelsData.length} {props.model.modelNamePlural}
            </div>
          </div>)}
        </Card>
      </ListContainer>
    )
}


ModelList.propTypes = {
  setLastAction: PropTypes.func.isRequired,
  setActionSuccessMessage: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired
}

export default ModelList
