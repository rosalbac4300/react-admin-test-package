import React, { createContext, useEffect, useState, useContext } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { UserContext } from './'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

interface DataContextProps {
  models: Array<any> | null,
  getModelData(model: string): Promise<any>, 
  modelsOptions: Array<any> | null,
  modifyItem(model: string, id: string, object: any): Promise<any>,
  deleteItem(model: string, id: string): Promise<any>,
  addItem(model: string, object: object): Promise<any>,
  getData(): Promise<any> 
}

export const DataContext = createContext<DataContextProps>({} as DataContextProps)

interface DataProviderProps {
  children: JSX.Element | JSX.Element[]
}

const DataProvider = (props: DataProviderProps) => {
  const [models, setModels] = useState<any>(null)
  const [modelsOptions, setModelsOptions] = useState<any>(null)

  const { handleLogout, handleRefreshToken } = useContext(UserContext)

  const getModelData = async (model: string) => {
    const url = `/api/${model}/`

    try {
      const data = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })

      return data.data
    } catch (error: any) {
      if (error.response.status == 401) {
        handleRefreshToken().then((refresh: number) => {
          if (refresh === 200) {
            getModelData(model)
          } else {
            if (window.location.pathname.split('/').pop() !== 'login') {
              handleLogout()
            }
          }
        })
      }
    }
  }

  const getModelOptions = async (model: string) => {
    const url = `/api/${model}/`

    try {
      const options = await axios({
        method: 'OPTIONS',
        url: url,
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })

      return options.data
    } catch (error: any) {
      if (error.response.status == 401) {
        handleRefreshToken().then((refresh: any) => {
          if (refresh === 200) {
            getModelOptions(model)
          } else {
            if (window.location.pathname.split('/').pop() !== 'login') {
              handleLogout()
            }
          }
        })
      }
    }
  }

  const getData = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/api/',
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })

      const data = response.data
      const backendModels = Object.keys(data)
      setModels(backendModels)

      var backendOptions = {}

      for (const model of backendModels) {
        const url = `/api/${model}/`

        const options = await axios({
          method: 'OPTIONS',
          url: url,
          headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
        })

        backendOptions = {
          ...backendOptions,
          [model]: options.data
        }
      }

      setModelsOptions(backendOptions)
    } catch (error: any) {
      if (error.response.status == 401) {
        handleRefreshToken().then((refresh: any) => {
          if (refresh === 200) {
            getData()
          } else {
            if (window.location.pathname.split('/').pop() !== 'login') {
              handleLogout()
            }
          }
        })
      }
    }
  }

  useEffect(() => {
    getData()
  }, [localStorage.getItem('user')])

  const modifyItem = async (model: string, id: string, object: any) => {
    const url = `/api/${model}/${id}/`

    try {
      const response = await axios.put(url, object, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })

      if (response.statusText !== 'OK') {
        const message = 'Error with Status Code: ' + response.status
        throw new Error(message)
      }

      return response
    } catch (error: any) {
      if (error.response.status == 401) {
        handleRefreshToken().then((refresh: any) => {
          if (refresh === 200) {
            modifyItem(model, id, object)
          } else {
            handleLogout()
          }
        })
      }
    }
  }

  const addItem = async (model: string, object: object) => {
    const url = `/api/${model}/`

    const response = await axios.post(url, object, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
    })

    try {
      if (response.status !== 200 && response.status !== 201) {
        const message = 'Error with Status Code: ' + response.status
        throw new Error(message)
      }

      return response.data
    } catch (error: any) {
      if (error.response.status == 401) {
        handleRefreshToken().then((refresh: any) => {
          if (refresh === 200) {
            addItem(model, object)
          } else {
            handleLogout()
          }
        })
      }
    }
  }

  const deleteItem = async (model: string, id: string) => {
    const url = `/api/${model}/${id}`

    try {
      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })

      if (response.status !== 200 && response.status !== 204) {
        const message = 'Error with Status Code: ' + response.status
        throw new Error(message)
      }

      return response
    } catch (error: any) {
      if (error.response.status == 401) {
        handleRefreshToken().then((refresh: any) => {
          if (refresh === 200) {
            deleteItem(model, id)
          } else {
            handleLogout()
          }
        })
      }
    }
  }

  return (
    <DataContext.Provider value={{ models, getModelData, modelsOptions, modifyItem, deleteItem, addItem, getData }}>
      {props.children}
    </DataContext.Provider>
  )
}

export default DataProvider

DataProvider.propTypes = {
  children: PropTypes.node.isRequired
}
