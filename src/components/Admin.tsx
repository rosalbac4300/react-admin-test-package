import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import GlobalStyles from '../helpers/GlobalStyles'
import { App } from '.'
import { DataProvider, UserProvider } from '../context'
import { Login } from '../pages'

const ProtectedRoute = (props: {children: JSX.Element}) => {
    if (localStorage.getItem('access') === null) return <Navigate to={'/login'} replace />
    return props.children
}

interface AuthType {
    refreshURL: string,
    loginURL: string,
    userProviderURL: string ,
    groupsProviderURL: string,
    permissionsURL: string,
    deleteUser: string,
    registerUser: string,
    changePassword: string
}

const Admin = (prop: {children: any}) => {
    const [adminApps, setAdminApps] = useState<Array<any>>([])
    const [adminAuth, setAdminAuth] = useState<AuthType | null>(null)

    const getApps = useCallback(() => {
        if (prop.children === undefined) {
            console.error("A child 'AdminApp' or 'AdminAuth' component is needed.")
        } else if(prop.children.length === undefined) {
            if (prop.children.type.name === "AdminApp") {
                var provURL
                if(prop.children.props.dataProviderURL.slice(-1) !== '/'){
                    provURL = prop.children.props.dataProviderURL
                } else {
                    provURL = prop.children.props.dataProviderURL.slice(0, -1)
                }

                const app = {
                    appName: prop.children.props.appName,
                    children: getAppChildren(prop.children.props.children),
                    providerUrl: provURL
                }

                setAdminApps([app])
            }
            if (prop.children.type.name === "AdminAuth") {
                const admAuth = {
                    refreshURL: prop.children.props.refreshURL,
                    loginURL: prop.children.props.loginURL,
                    userProviderURL: prop.children.props.userProviderURL,
                    groupsProviderURL: prop.children.props.groupsProviderURL,
                    permissionsURL: prop.children.props.permissionsURL,
                    deleteUser: prop.children.props.deleteUser,
                    registerUser: prop.children.props.registerUser,
                    changePassword: prop.children.props.changePassword
                }
                setAdminAuth(admAuth)
            }
        } else {
            const filteredChildren = prop.children.filter((element: any) => element.type.name === "AdminApp")
            const auth = prop.children.filter((element: any) => element.type.name === "AdminAuth")
    
            if (auth.length > 1) {
                console.error("There can only be one AdminAuth element")
            } else if (auth.length === 1){
                const admAuth = {
                    refreshURL: auth[0].props.refreshURL,
                    loginURL: auth[0].props.loginURL,
                    userProviderURL: auth[0].props.userProviderURL,
                    groupsProviderURL: auth[0].props.groupsProviderURL,
                    permissionsURL: auth[0].props.permissionsURL,
                    deleteUser: auth[0].props.deleteUser,
                    registerUser: auth[0].props.registerUser,
                    changePassword: auth[0].props.changePassword
                }
                setAdminAuth(admAuth)
            }
            
            const apps = filteredChildren.map((element: any) => {
                const elemChildren = getAppChildren(element.props.children)

                var provURL
                if(element.props.dataProviderURL.slice(-1) !== '/'){
                    provURL = element.props.dataProviderURL
                } else {
                    provURL = element.props.dataProviderURL.slice(0, -1)
                }

                const app = {
                    appName: element.props.appName,
                    children: elemChildren,
                    providerUrl: provURL
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
            var plural;
            var api;

            if(!children.props.modelNamePlural){
                plural = children.props.modelName + 's'
            } else {
                plural = children.props.modelNamePlural
            }

            if(!children.props.apiURLName){
                api = children.props.modelName
            } else {
                api = children.props.apiURLName
            }

            api = api.slice(-1) !== '/' ? api : api.slice(0,-1)

            const child = {
                modelName: children.props.modelName,
                modelNamePlural: plural,
                apiURLName: api
            }
            return [child]
        } else {
            const elemChildren = children.map((child: any) => {
                var plural;
                var api;

                if(!child.props.modelNamePlural){
                    plural = child.props.modelName + 's'
                } else {
                    plural = child.props.modelNamePlural
                }

                if(!child.props.apiURLName){
                    api = child.props.modelName
                } else {
                    api = child.props.apiURLName
                }
                
                api = api.slice(-1) !== '/' ? api : api.slice(0,-1)

                return ({
                    modelName: child.props.modelName,
                    modelNamePlural: plural,
                    apiURLName: api
                })
            })
            return elemChildren
        }
    }

    useEffect(() => {
        getApps()
    }, [getApps])

    return (
        <UserProvider
            refreshURL={adminAuth ? adminAuth.refreshURL : ''}
            loginURL={adminAuth ? adminAuth.loginURL : ''}
            userProviderURL={adminAuth ? adminAuth.userProviderURL : ''}
            groupsProviderURL={adminAuth ? adminAuth.groupsProviderURL : ''}
            permissionsURL={adminAuth ? adminAuth.permissionsURL : ''}
            deleteUser={adminAuth ? adminAuth.deleteUser : ''}
            registerUser = {adminAuth ? adminAuth.registerUser : ''}
            changePassword = {adminAuth ? adminAuth.changePassword : ''}
        >
            <DataProvider>
                <BrowserRouter>
                    <GlobalStyles />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/*" element={
                            <ProtectedRoute>
                                <App apps={adminApps} auth={adminAuth}/>
                            </ProtectedRoute>
                            }/>
                    </Routes>
                </BrowserRouter>
            </DataProvider>
        </UserProvider>
    )
}

Admin.propTypes = {
  children: PropTypes.node.isRequired
}

export default Admin