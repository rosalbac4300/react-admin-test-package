import React, { useState, useContext, useEffect } from 'react'
import { useParams, Route, Routes } from 'react-router-dom'
import { ComponentWrapper, Header, SuccessMessage } from '../../common'
import Form from '../Form/Form'
import ModelList from './ModelList'

interface ModelListProps { 
    apps: Array<any>,
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

const ModelManage = (props: ModelListProps) => {
  const { model, app } = useParams()
  const [lastAction, setLastAction] = useState('')
  const [nextAction, setNextAction] = useState('')
  const [ providerURL, setProviderURL ] = useState('')
  const [actionSuccessMessage, setActionSuccessMessage] = useState(false)
  const [currentModel, setCurrentModel] = useState(null)

  const closeSuccessMessage = () => {
    setActionSuccessMessage(false)
  }

  const getCurrentModel = () => {
    props.apps.map((element) => {
      if(element.appName === app){
        element.children.map((child: any) => {
          if(child.modelName === model) {
            setCurrentModel(child)
          }
        })
      }
    })
  }

  const getProviderURL = () => {
    props.apps.map((element) => {
      if(element.appName === app){
        setProviderURL(element.providerUrl)
      }
    })
  }

  useEffect(() => {
    getCurrentModel()
    getProviderURL()
  }, [model, app])

  useEffect(() => {

  }, [currentModel])


  return currentModel !== null ? (
    <ComponentWrapper>
        <Header title={model ? model : ''} />
        {actionSuccessMessage && (
          <SuccessMessage lastAction={lastAction} nextAction={nextAction} onClick={closeSuccessMessage} />
        )}
         <Routes>
          <Route
            path="/:id/change"
            element={
              <Form
                change = {true}
                currentModel = {currentModel}
                providerURL = {providerURL}
                auth = {props.auth}
                setLastAction={setLastAction}
                setNextAction={setNextAction}
                setActionSuccessMessage={setActionSuccessMessage}
              />
            }
          />
          <Route
            path="/add"
            element={
              <Form
                change={false}
                currentModel = {currentModel}
                providerURL = {providerURL}
                auth = {props.auth}
                setLastAction={setLastAction}
                setNextAction={setNextAction}
                setActionSuccessMessage={setActionSuccessMessage}
              />
            }
          />
          <Route
            path="/"
            element={ 
              <ModelList 
                setLastAction={setLastAction} 
                setActionSuccessMessage={setActionSuccessMessage} 
                model = {currentModel}
                providerURL = {providerURL}
              />
            }
          />
        </Routes>
    </ComponentWrapper>
  ) : (<></>)
}

export default ModelManage