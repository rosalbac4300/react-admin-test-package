import React, { useState, useCallback, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useParams, useNavigate } from 'react-router-dom'
import { validateInput, validateEmailInput } from '../../helpers/validateForm'
import {
  Card, 
  Button, 
  ChoiceInput,
  DateInput, 
  EmailInput,
  NumberInput,
  TextInput,
  ListContainer
} from '../../common'
import { DataContext, UserContext } from '../../context'
import { ErrorMessage, SuccessCard } from '../../common'

interface FormProps {
  change: boolean, 
  setLastAction(message: string): void,
  setNextAction(message: string): void,
  setActionSuccessMessage(message: boolean): void,
  currentModel: {
    modelName: string,
    modelNamePlural: string,
    apiURLName: string
  },
  providerURL: string,
  auth: {
    refreshURL: string,
    loginURL: string,
    userProviderURL: string ,
    groupsProviderURL: string,
    permissionsURL: string,
    deleteUser: string,
    registerUser: string,
    changePassword: string
  } | null
}

const Form = (props: FormProps) => {
  const navigate = useNavigate()
  const { id, model, app } = useParams()
  const { getModelOptions, getModelData, modifyItem, deleteItem, addItem } = useContext(DataContext)
  const { listIncludesPermission } = useContext(UserContext)

  /*
      fields will be an array of arrays, where for each array:
      fields[i][0] is the Label
      fields[i][1] is the field type
      fields[i][2] is the object's attribute
  */
  const [fields, setFields] = useState<any>(null)
  const [modelsData, setModelsData] = useState<any>(null)
  const [modelsOptions, setModelsOptions] = useState<any>(null)
  const [choices, setChoices] = useState<any>(null)
  const [formData, setFormData] = useState<any>(null)

  const [actionErrorMessage, setActionErrorMessage] = useState(false)

  const [userCanAdd, setUserCanAdd] = useState(false)
  const [userCanView, setUserCanView] = useState(false)
  const [userCanChange, setUserCanChange] = useState(false)
  const [userCanDelete, setUserCanDelete] = useState(false)

  const getFields = useCallback(async () => {
    if(modelsOptions !== null && modelsOptions !== undefined) {
      const attributes = Object.keys(modelsOptions.fields)
      const field: any[] = []
      
      var choice = {}
      var modelForm = {}

      if(model !== undefined){
        const response = await getModelData(props.providerURL, props.currentModel.apiURLName)

        if(id !== undefined && props.change) {
          const apiData = response.find((item: any) => {
            if (item.pk === parseInt(id)) {
              return item
            }
          })

          setModelsData(apiData)

          attributes.forEach((attr) => {
            if (modelsOptions.fields[attr].required) {
              const label = modelsOptions.fields[attr].label
              const type = modelsOptions.fields[attr].type

              modelForm = {
                ...modelForm,
                [attr]: apiData[attr]
              }

              if (type === 'choice') {
                choice = {
                  ...choice,
                  [attr]: modelsOptions.fields[attr].choices
                }
              }

              field.push([label, type, attr])
            }
          })

          setFormData(modelForm)
          setFields(field)
          setChoices(choice)
        } else {
          attributes.forEach((attr) => {
            if (modelsOptions.fields[attr].required) {
              const label = modelsOptions.fields[attr].label
              const type = modelsOptions.fields[attr].type

              modelForm = {
                ...modelForm,
                [attr]: ''
              }

              if (type === 'choice') {
                choice = {
                  ...choice,
                  [attr]: modelsOptions.fields[attr].choices
                }
              }

              field.push([label, type, attr])
            }
          })

          setFormData(modelForm)
          setFields(field)
          setChoices(choice)
        }  
      }
    }
  }, [modelsOptions, model, props.change])

  const getOptions = useCallback(async () => {
    if (model !== undefined) {
      const response = await getModelOptions(props.providerURL, props.currentModel.apiURLName)
      setModelsOptions(response)
    }
  }, [model])

  const getPermissions = useCallback(() => {
    setUserCanAdd(listIncludesPermission('backend', props.currentModel.modelName, 'add'))
    setUserCanChange(listIncludesPermission('backend', props.currentModel.modelName, 'change'))
    setUserCanDelete(listIncludesPermission('backend', props.currentModel.modelName, 'delete'))
    setUserCanView(listIncludesPermission('backend', props.currentModel.modelName, 'view'))
  }, [props.currentModel.modelName])

  useEffect(() => {
    getOptions()
  }, [getOptions])

  useEffect(() => {
    getFields()
    getPermissions()
  }, [getFields, getPermissions])

  const handleInputChange = (value: any, attribute: string) => {
    const newData = {
      ...formData,
      [attribute]: value
    }

    setFormData(newData)
  }

  const saveChanges = async () => {
    if(model !== undefined) {
      const status = await modifyItem(props.providerURL, props.currentModel.apiURLName, modelsData.pk, formData)

      if (status.status === 200) {
        props.setActionSuccessMessage(true)
        props.setLastAction(`The ${props.currentModel.modelName} ${modelsData.display_name} was changed successfully.`)
      }
    }
  }

  const addNewItem = async () => {
    if (model !== undefined) {
      const addedItem = await addItem(props.providerURL, props.currentModel.apiURLName, formData)
      props.setActionSuccessMessage(true)
      props.setLastAction(`The ${props.currentModel.modelName} ${addedItem.display_name} was added successfully.`)
      return addedItem
    }
  }

  const validateData = () => {
    var validData = true

    fields.forEach((field: any) => {
      const data = formData[field[2]]

      switch (field[1]) {
        case 'string':
          validData = validData && validateInput(data)
          break
        case 'email':
          validData = validData && validateEmailInput(data)
          break
        case 'choice':
          validData = validData && validateInput(data)
          break
      }
    })

    setActionErrorMessage(!validData)
    return validData
  }

  const onSubmit = (e: any) => {
    e.preventDefault()
  }

  const onSave = () => {
    if (!validateData()) {
      return
    }

    if (props.change) {
      saveChanges()
    } else {
      addNewItem()
    }

    props.setNextAction('')

    if (userCanView || userCanChange) {
      navigate(`/${app}/${model}`)
    } else {
      navigate('/')
    }
  }

  const onDelete = async () => {
    if(model !== undefined) {
      const status = await deleteItem(props.providerURL, props.currentModel.apiURLName, modelsData.pk)
  
      if (status.status === 204) {
        props.setActionSuccessMessage(true)
        props.setLastAction(`Successfully deleted the ${props.currentModel.modelName} ${modelsData.display_name}.`)
      }
  
      props.setNextAction('')
      navigate(`/${app}/${model}`)
    }
  }

  const onSaveAndAdd = () => {
    if (!validateData()) {
      return
    }

    if (props.change) {
      saveChanges()
    } else {
      addNewItem()
    }

    props.setNextAction(`You may add another ${props.currentModel.modelName} below.`)
    getFields()
    navigate(`/${app}/${model}/add`)
  }

  const onSaveAndContine = async () => {
    if (!validateData()) {
      return
    }

    if (props.change) {
      saveChanges()
    } else {
      const addedItem = await addNewItem()
      const id = addedItem.pk
      navigate(`/${app}/${model}/${id}/change`)
    }

    props.setNextAction('You may edit it again below')
  }

  const onclose = () => {
    navigate(`/${app}/${model}`)
  }

  return ( 
    (choices !== null && fields !== null && modelsOptions !== null)
    && (
      modelsData !== null || !props.change
    ) ? (
    <ListContainer>
      {actionErrorMessage && <ErrorMessage />}
        <form className="col-12" onSubmit={onSubmit}>
          <div className="row">
            <div className="col-lg-9 col-sm-12 col-md-12">
              <Card>
                <div className="card-header">
                  {props.change ? (userCanChange ? 'Change' : 'View') : userCanAdd ? 'Add' : 'View'} {props.currentModel.modelName}
                </div>
                <div className="card-body">
                  {fields.map((field: any) => {
                    switch (field[1]) {
                      case 'string':
                        return (
                          <TextInput
                            editable={(props.change && userCanChange) || (!props.change && userCanAdd)}
                            error={actionErrorMessage}
                            label={field[0]}
                            value={formData[field[2]]}
                            key={field[0]}
                            attribute={field[2]}
                            onChange={handleInputChange}
                          />
                        )
                      case 'date':
                        return (
                          <DateInput
                            editable={(props.change && userCanChange) || (!props.change && userCanAdd)}
                            label={field[0]}
                            value={formData[field[2]]}
                            key={field[0]}
                            attribute={field[2]}
                            onChange={handleInputChange}
                          />
                        )
                      case 'integer':
                        return (
                          <NumberInput
                            editable={(props.change && userCanChange) || (!props.change && userCanAdd)}
                            label={field[0]}
                            value={formData[field[2]]}
                            key={field[0]}
                            attribute={field[2]}
                            onChange={handleInputChange}
                          />
                        )
                      case 'float':
                        return (
                          <NumberInput
                            editable={(props.change && userCanChange) || (!props.change && userCanAdd)}
                            label={field[0]}
                            value={formData[field[2]]}
                            key={field[0]}
                            attribute={field[2]}
                            onChange={handleInputChange}
                          />
                        )
                      case 'choice':
                        return (
                          <ChoiceInput
                            error={actionErrorMessage}
                            editable={(props.change && userCanChange) || (!props.change && userCanAdd)}
                            label={field[0]}
                            value={formData[field[2]]}
                            key={field[0]}
                            attribute={field[2]}
                            onChange={handleInputChange}
                            choices={choices[field[2]]}
                          />
                        )
                      case 'email':
                        return (
                          <EmailInput
                            error={actionErrorMessage}
                            editable={(props.change && userCanChange) || (!props.change && userCanAdd)}
                            label={field[0]}
                            value={formData[field[2]]}
                            key={field[0]}
                            attribute={field[2]}
                            onChange={handleInputChange}
                          />
                        )
                    }
                  })}
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
                  {((props.change && userCanChange) || (!props.change && userCanAdd)) && (
                    <Button bgColor="#469408" onClick={onSave} type="button">
                      Save
                    </Button>
                  )}
                  {props.change && userCanDelete && (
                    <Button bgColor="darkorchid" onClick={onDelete} type="button">
                      Delete
                    </Button>
                  )}
                  {props.change && !userCanChange && (
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
  ) : (<></>))
}

Form.propTypes = {
  change: PropTypes.bool,
  setLastAction: PropTypes.func.isRequired,
  setNextAction: PropTypes.func.isRequired,
  setActionSuccessMessage: PropTypes.func.isRequired,
  currentModel: PropTypes.object.isRequired,
  providerURL: PropTypes.string.isRequired,
  auth: PropTypes.object
}

export default Form