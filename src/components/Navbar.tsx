import React, { useCallback, useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faKey, faUsers } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { Card, NavbarStyled } from '../styled'
import { UserContext } from '../context'

interface NavbarProps {
  onClick: (event: any) => void,
  auth: {
    refreshURL: string,
    loginURL: string,
    userProviderURL: string ,
    groupsProviderURL: string | null
  } | null
}

const Navbar = (props: NavbarProps) => {
  const navigate = useNavigate()
  const [popup, setPopup] = useState(false)
  const { handleLogout, listIncludesPermission } = useContext(UserContext)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const handleUserMenuClick = useCallback(() => {
    setPopup((value) => !value)
  }, [])

  const logout = () => {
    handleLogout()
    navigate('/login')
  }

  return (
    <NavbarStyled>
      <ul className="nav">
        <button className="nav-link" onClick={props.onClick}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </ul>
      <ul className="nav">
        <li className="nav-link">
          <i className="fas fa-th"></i>
        </li>
        { props.auth !== null && (
          <li className="nav-link">
            <button className="nav-button" onClick={handleUserMenuClick}>
            <FontAwesomeIcon icon={faUser} />
            </button>
          </li>
        )}
      </ul>
      {popup && (
        <Card noColouredBorder className="popup">
          <div className="popup-title"> Account </div>
          <div className="popup-option">
            <Link to="/password_change">
             <FontAwesomeIcon icon={faKey} /> Change Password
            </Link>
          </div>
          <div className="popup-option">
            {/* <button onClick={logout}>
              <FontAwesomeIcon icon={faUsers} /> Log Out
            </button> */}
          </div>
          {/* {listIncludesPermission('customuser') && (
            <div className="popup-option">
              <a href={`/auth/users/${currentUser.id}/change`}> See Profile </a>
            </div>
          )} */}
        </Card>
      )}
    </NavbarStyled>
  )
}

Navbar.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default Navbar
