import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import useBreadcrumbs from 'use-react-router-breadcrumbs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons'
import { HeaderStyled } from '../styled'
//import { DataContext, UserContext } from '../context'

const Header = (props: { title: string }) => {
  //const { getModelData } = useContext(DataContext)
  //const { getUsers, getGroups } = useContext(UserContext)
  const [modelsDisplayName, setModelsDisplayName] = useState(null)

  const DynamicModelBreadcrumb = (props: { match: any }) => {
    return <span>{modelsDisplayName}</span>
  }

  const HomeBreadcrumb = () => (
    <span>
      <FontAwesomeIcon icon={faTachometerAlt}/> Home
    </span>
  )

  const routes = [
    { path: '/', breadcrumb: HomeBreadcrumb },
    { path: '/password_change', breadcrumb: 'Change Password' },
    { path: '/:app/:model/add', breadcrumb: 'Add' },
    { path: '/:app/:model/:id', breadcrumb: DynamicModelBreadcrumb },
    { path: '/:app/:model/:id/change', breadcrumb: null },
    { path: '/auth/users/:id/password', breadcrumb: 'Password Change' }
  ]

  const breadcrumbs = useBreadcrumbs(routes)

  return (
    <HeaderStyled>
      <div className="col-3 col-sm-12">
        <h1 className="title"> {props.title} </h1>
      </div>

      <nav className="col-9 col-sm-12 breadcrumbs">
        <ul className="breadcrumb">
          {breadcrumbs.map(({ match, breadcrumb }) => {
            if (match.params.id) {
              if (match.params.app === 'backend') {
                /* getModelData(match.params.model).then((response) => {
                  response.find((item) => {
                    if (item.pk === parseInt(match.params.id)) {
                      setModelsDisplayName(item.display_name)
                    }
                  })
                }) */
              }

              if (match.params.app === 'auth') {
                if (match.params.model === 'users') {
                  /* getUsers().then((response) => {
                    response.find((item) => {
                      if (item.pk === parseInt(match.params.id)) {
                        setModelsDisplayName(item.username)
                      }
                    })
                  }) */
                } else if (match.params.model === 'groups') {
                  /* getGroups().then((response) => {
                    response.find((item) => {
                      if (item.pk === parseInt(match.params.id)) {
                        setModelsDisplayName(item.name)
                      }
                    })
                  }) */
                }
              }

              return (
                modelsDisplayName !== null && (
                  <li key={match.pathname}>
                    <NavLink className="breadcrumb-item" to={match.pathname}>
                      {breadcrumb}
                    </NavLink>
                    <span className="breadcrumb-divide"> / </span>
                  </li>
                )
              )
            } else {
              return (
                <li key={match.pathname}>
                  <NavLink className="breadcrumb-item" to={match.pathname}>
                    {breadcrumb}
                  </NavLink>
                  <span className="breadcrumb-divide"> / </span>
                </li>
              )
            }
          })}
        </ul>
      </nav>
    </HeaderStyled>
  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired
}

export default Header
