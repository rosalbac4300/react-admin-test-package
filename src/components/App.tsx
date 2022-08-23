import React, { useState, useRef, useEffect, useCallback, useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Navbar, Sidebar, Wrapper } from '../common'
import { Dashboard, ModelManage, AuthManage, PasswordChange } from '../pages'
import { useWindowSize } from '../hooks'

interface AppProps {
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

const App = (props: AppProps) => {
  const wrapper = useRef<any>()
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)
  const [sidebarSize, setSidebarSize] = useState('74px')
  const [sidebarClick, setSidebarClick] = useState(false)

  const width = useWindowSize()

  const openSidebar = useCallback(() => {
    if (isSidebarHovered) {
      setSidebarSize('250px')

        if (width !== undefined){
            if (width >= 960) {
              wrapper.current.style.left = '248px'
            }
        }

    } else if (sidebarClick) {
      setSidebarSize('250px')

      if (width !== undefined){
          if (width >= 720) {
            wrapper.current.style.left = '248px'
          } 
      }
    } else if (!isSidebarHovered && !sidebarClick) {
      setSidebarSize('74px')
      wrapper.current.style.transition = '0.5s'

      if (width !== undefined){
          if (width >= 720) {
            wrapper.current.style.left = '74px'
          } else {
            wrapper.current.style.left = '0px'
          } 
      }

    } else if (!sidebarClick) {
      setSidebarSize('74px')
      wrapper.current.style.transition = '0.5s'

      if (width !== undefined){
          if (width >= 720) {
            wrapper.current.style.left = '74px'
          } else {
            wrapper.current.style.left = '0px'
          } 
      }

    }
  }, [sidebarClick, isSidebarHovered, width])

  const handleHoverSidebar = useCallback(() => {
    setIsSidebarHovered((value) => !value)
  }, [])

  const handleClickSidebar = useCallback((event: any) => {
    event.stopPropagation()
    setSidebarClick((value) => !value)
  }, [])

  const handleClickWrapper = useCallback(() => {
    setSidebarClick(false)
  }, [])

  const dummy = (text: any) => {}

  useEffect(() => {
    openSidebar()
  }, [openSidebar])

  return (
    <>
      <Sidebar size={sidebarSize} onHover={handleHoverSidebar} apps={props.apps} auth ={props.auth}/>
      <Wrapper ref={wrapper} onClick={handleClickWrapper}>
        <Navbar onClick={handleClickSidebar} auth={props.auth} />
        <Routes>
          <Route path="/auth/:model/*" element={<AuthManage />} />
          <Route path="/password_change" element={<PasswordChange currentUser setLastAction={dummy} setActionSuccessMessage={dummy} />} />
          <Route path="/:app/:model/*" element={<ModelManage apps={props.apps} auth={props.auth}/>} />
          <Route path="/:app" element={<Dashboard apps={props.apps} auth={props.auth}/>} />
          <Route path="/" element={<Dashboard apps={props.apps} auth={props.auth}/>} />
        </Routes>
      </Wrapper>
    </>
  )
}

export default App
