import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { Card, Button } from '../../common'
import { Header } from '../../common'
import DashboardStyled from "./Styles"

interface AppProps {
  apps: Array<any>, 
  auth: {
    refreshURL: string,
    loginURL: string,
    userProviderURL: string ,
    groupsProviderURL: string | null
  } | null
}
  
const Dashboard = (props: AppProps) => {
  const { app } = useParams()

  return (
    <DashboardStyled>
      <Header title={app ? app : 'Dashboard'}/>
      <div className="body">
        <div className="row">
          <div className="col-12 col-lg-9">
            <div className="row">
            { props.auth !== null && (
                <div className="col-6 col-sm-12">
                  <Card noColouredBorder={false}>
                    <div className="card-header"> Authentication and Authorization </div>
                    <div className="card-body">
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              <Link to="/auth/users/" className="link">
                                Users
                              </Link>
                            </td>
                            <td className="buttons">
                              <Link to="/auth/users/add">
                                <Button inline primary={false} bgColor="#469408">
                                  Add
                                </Button>
                              </Link>
                              <Link to="/auth/users/">
                                <Button inline primary={false} bgColor="#029acf">
                                  Change
                                </Button>
                              </Link>
                            </td>
                          </tr>
                          { props.auth.groupsProviderURL !== null &&(
                            <tr>
                              <td>
                                <Link to="/auth/groups/" className="link">
                                  Groups
                                </Link>
                              </td>
                              <td className="buttons">
                                <Link to="/auth/groups/add">
                                  <Button inline primary={false} bgColor="#469408">
                                    Add
                                  </Button>
                                </Link>
                                <Link to="/auth/groups/">
                                  <Button inline primary={false} bgColor="#029acf">
                                    Change
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}
              {props.apps.length !== 0 && props.apps.map((app:any) => {
                  return (
                    <div className="col-6 col-sm-12" key={app.appName}> 
                      <Card noColouredBorder={false}>
                        <div className="card-header">{app.appName}</div>
                        <div className="card-body">
                          <table>
                            <tbody>
                              { app.children.map((child: any) => {
                                return (
                                  <tr key={child.modelName}>
                                    <td>
                                      <Link to={`/${app.appName}/${child.modelName}/`} className="link">
                                        {child.modelName}
                                      </Link>
                                    </td>
                                    <td className="buttons">
                                      <Link to={`/${app.appName}/${child.modelName}/add`} >
                                        <Button inline primary={false} bgColor="#469408">
                                          Add
                                        </Button>
                                      </Link>
                                      <Link to={`/${app.appName}/${child.modelName}/`}>
                                        <Button inline primary={false} bgColor="#029acf">
                                          Change
                                        </Button>
                                      </Link>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    </div>
                  )
              })}
            </div>
          </div>
          <div className="col-12 col-lg-3">
            <h1 className="actions"> Recent actions </h1>
            <div className="row">
              <div className="col-2">
                <div className="circle-blue">
                  <FontAwesomeIcon icon={faEdit}/>
                </div>
              </div>
              <div className="col-10">
                <div className="timeline-card">
                  <div className="timeline-card-header">
                    <div className="col-4">
                      <Link to="/" className="link">
                        <div className=""></div>
                      </Link>
                    </div>
                    <div className="col-8">
                      <span className="time">
                        <i className="fas fa-clock"></i>
                        Time
                      </span>
                    </div>
                    </div>
                    <div className="timeline-card-body">
                      <span> Action </span>
                      Detail
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
   </DashboardStyled>
  )
}

export default Dashboard