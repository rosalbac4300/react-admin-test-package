import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Navbar, Sidebar, Dashboard/* , ManageModel, AuthManage, PasswordChange */ } from '../components'
import { useWindowSize } from '../hooks'
import { AppStyled, Wrapper } from '../styled'

interface AppProps {
  apps: Array<any>,
  auth: {
    refreshURL: string,
    loginURL: string,
    userProviderURL: string ,
    groupsProviderURL: string | null
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

  useEffect(() => {
    openSidebar()
  }, [openSidebar])

  return (
    <AppStyled>
      <Sidebar size={sidebarSize} onHover={handleHoverSidebar} apps={props.apps} auth ={props.auth}/>
      <Wrapper ref={wrapper} onClick={handleClickWrapper}>
        <Navbar onClick={handleClickSidebar} auth={props.auth} />
        <Routes>
          { props.auth !== null && (
            <>
              {/* <Route path="/auth/:model/*" element={<AuthManage />} />
              <Route path="/password_change" element={<PasswordChange currentUser />} /> */}
            </>
          )}
          {/* <Route path="/:app/:model/*" element={<ManageModel apps={props.apps} />} />
           */}
          <Route path="/:app" element={<Dashboard apps={props.apps} auth={props.auth}/>} />
          <Route path="/" element={<Dashboard apps={props.apps} auth={props.auth}/>} />
        </Routes>
      </Wrapper>
    </AppStyled>
  )
}

export default App
