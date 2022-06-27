import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle, faTachometerAlt, faAngleLeft, faCircle, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons'
import {  } from '@fortawesome/free-regular-svg-icons'
import { SidebarStyled } from '../styled'
import { useWindowSize } from '../hooks'
//import img from '../img/img'
//import { DataContext, UserContext } from '../context'

interface SidebarProps {
  size: string,
  onHover: () => void,
  apps: Array<any>
}

const Sidebar = (props: SidebarProps) => {
  const aside = useRef<any>()
  const width = useWindowSize()
 // const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  //const { models, modelsOptions } = useContext(DataContext)
  //const { listIncludesPermission } = useContext(UserContext)
  const [isDropdownOpen, setIsDropdownOpen] = useState<Array<boolean>>([])

  const setDropdownOpenArray = useCallback(() => {
    const array = props.apps.map((app:any) => false)
    setIsDropdownOpen(array)
  }, [props.apps])

  const openSidebarTransitions = useCallback(() => {
    if (props.size === '74px') {
      aside.current.style.transition = '0.5s'
      aside.current.style.width = '74px'

      if (width !== undefined) {
        if (width <= 720) {
          aside.current.style.left = '-74px'
        } else {
          aside.current.style.left = '0px'
        }}
    } else {
      aside.current.style.transition = '0.5s'
      aside.current.style.width = '250px'
      aside.current.style.left = '0px'
    }
  }, [aside, width, props.size])

  const openDropdownTransitions = useCallback(() => {
    //TODO: Write and test this function
  }, [])

  const handleDropdown = useCallback((i : number) => {
    setIsDropdownOpen((value: Array<boolean>) => {
      const array = value.map((val: boolean, int: number) => {
        if (int === i) {
          return !val
        }
        else {
          return false
        }
      }) 

      return array
    })
  }, [])

  useEffect(() => {
    setDropdownOpenArray()
  }, [setDropdownOpenArray])

  useEffect(() => {
    openSidebarTransitions()
    openDropdownTransitions()
  }, [openSidebarTransitions, openDropdownTransitions])

  return (
    <SidebarStyled ref={aside} className="sidebar" onMouseEnter={props.onHover} onMouseLeave={props.onHover}>
      <Link to="/" className="sb-logo">
        {/* <img src={img.logo} height="27px" alt=""></img> */}
        {props.size === '250px' && <span> Admin </span>}
      </Link>
      <Link to={`/auth/users/user}/change`} className="sb-user">
        <div className="icon">
          <FontAwesomeIcon icon={faUserCircle} />
        </div>
        {props.size === '250px' && <span> Username </span>}
      </Link>

      {(props.apps.length !== 0 && isDropdownOpen.length !== 0) && (<nav className="sb-navigation">
        <ul className="sb-nav">
          <li className="sb-nav-item">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'sb-nav-link nav-link-active' : 'sb-nav-link')}>
            <div className="icon">
              <FontAwesomeIcon icon={faTachometerAlt} />
            </div>
              {props.size === '250px' && <span> Dashboard </span>}
            </NavLink>
          </li>
          { props.apps.map((app :  any, i : number) => {
            return (
              <li className="sb-nav-item" key={i}>
                <div className="sb-nav-link" onClick={() => handleDropdown(i)}>
                <div className="icon">
                  <FontAwesomeIcon icon={faCircleChevronRight} />
                </div>
                  {props.size === '250px' && (
                    <>
                      <span> {app.appName} </span>
                      <div className="arrow">
                        { isDropdownOpen[i] ? 
                          <FontAwesomeIcon icon={faAngleLeft} rotation={270}/> :
                          <FontAwesomeIcon icon={faAngleLeft} />
                        }
                      </div>
                    </>
                  )}
                </div>
                <ul className="nav nav-child">
                  {isDropdownOpen[i] && (
                    app.children.map((child: any) => {
                      return (
                        <li className="sb-nav-item" key={child.modelName}>
                            <NavLink
                              to={`/${app.appName}/${child.modelName}`}
                              className={({ isActive }) => (isActive ? 'sb-nav-link nav-child-active' : 'sb-nav-link')}
                            >
                              <div className="icon">
                                <FontAwesomeIcon icon={faCircle}/>
                              </div>
                              {props.size === '250px' && <span> {child.modelName} </span>}
                            </NavLink>
                        </li>
                      )
                    })
                  )}
                </ul>
              </li>
            )
          })}
        </ul>
      </nav>)}
    </SidebarStyled>
  )
}

Sidebar.propTypes = {
  size: PropTypes.oneOf(['250px', '74px']),
  onHover: PropTypes.func.isRequired, 
  apps: PropTypes.array.isRequired
}

export default Sidebar
