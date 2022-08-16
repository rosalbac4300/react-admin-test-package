import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import GlobalStyles from '../helpers/GlobalStyles'
import { App } from '.'
import { DataProvider, UserProvider } from '../context'

const ProtectedRoute = (props: {children: JSX.Element | JSX.Element[]}) => {
    if (localStorage.getItem('access') === null) return <Navigate to={'/login'} replace />
    return props.children
}

interface AuthType {
    refreshURL: string,
    loginURL: string,
    userProviderURL: string ,
    groupsProviderURL: string | null
}

const Admin = (prop: {children: any}) => {
    const [adminApps, setAdminApps] = useState<Array<any>>([])
    const [adminAuth, setAdminAuth] = useState<AuthType | null>(null)

    const getApps = useCallback(() => {
        if (prop.children === undefined) {
            console.error("A child 'AdminApp' or 'AdminAuth' component is needed.")
        } else if(prop.children.length === undefined) {
            if (prop.children.type.name === "AdminApp") {
                const app = {
                    appName: prop.children.props.appName,
                    children: getAppChildren(prop.children.props.children),
                    providerUrl: prop.children.props.dataProviderURL
                }
                setAdminApps([app])
            }
            if (prop.children.type.name === "AdminAuth") {
                const admAuth = {
                    refreshURL: prop.children.props.refreshURL,
                    loginURL: prop.children.props.loginURL,
                    userProviderURL: prop.children.props.userProviderURL,
                    groupsProviderURL: prop.children.props.groupsProviderURL  
                }
                setAdminAuth(admAuth)
            }
        } else {
            const filteredChildren = prop.children.filter((element: any) => element.type.name === "AdminApp")
            const auth = prop.children.filter((element: any) => element.type.name === "AdminAuth")
    
            if (auth.length > 1) {
                console.error("There cam only be one AdminAuth element")
            } else if (auth.length === 1){
                const admAuth = {
                    refreshURL: auth[0].props.refreshURL,
                    loginURL: auth[0].props.loginURL,
                    userProviderURL: auth[0].props.userProviderURL,
                    groupsProviderURL: auth[0].props.groupsProviderURL  
                }
                setAdminAuth(admAuth)
            }
            
            const apps = filteredChildren.map((element: any) => {
                const elemChildren = getAppChildren(element.props.children)
                const app = {
                    appName: element.props.appName,
                    children: elemChildren,
                    providerUrl: element.props.dataProviderURL
                }
                
                return app
            })
    
            setAdminApps(apps)
        }
    }, [prop.children])

    const getAppChildren = (children : any) => {
        if (children === undefined) {
            console.error("At least one child 'Model' component is expected inside 'AdminApp' component")
            return []
        } else if (children.length === undefined) {
            const child = {
                modelName: children.props.modelName
            }
            return [child]
        } else {
            const elemChildren = children.map((child: any) => {
                return ({
                    modelName: child.props.modelName
                })
            })
            return elemChildren
        }
    }

    useEffect(() => {
        getApps()
    }, [getApps])

    return (
        <DataProvider>
            <UserProvider>
                <BrowserRouter>
                    <GlobalStyles />
                    <Routes>
                        <Route path="/*" element={<App apps={adminApps} auth={adminAuth}/>}/>
                    </Routes>
                </BrowserRouter>
            </UserProvider>
        </DataProvider>
    )
}

Admin.propTypes = {
  children: PropTypes.node.isRequired
}

export default Admin