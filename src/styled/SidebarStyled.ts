import styled from 'styled-components'

const SidebarStyled = styled.div`
  top: 0;
  height: 100vh;
  position: fixed;
  background-color: #343a40;
  transition: 0.5s;
  overflow: hidden;
  padding: 0;
  margin: 0;
  z-index: 4;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  color: #c2c7d0;

  @media (max-width: 720px) {
    left: -74px;
  }
  .sb-logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    height: auto;
    padding: 10px 12px 10px 12px;
    border-bottom: solid 1px rgb(75, 84, 92);
    color: #c2c7d0;
    text-decoration: none;
  }

  .sb-logo:hover {
    color: #fff;
  }

  .sb-logo img {
    position: relative;
    margin-left: 12px;
    margin-right: 12px;
  }

  .sb-user {
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    height: auto;
    padding: 16px;
    border-bottom: solid 1px rgb(75, 84, 92);
    color: #c2c7d0;
    text-decoration: none;
  }

  .sb-user:hover {
    color: #fff;
  }

  .sb-user .icon {
    font-size: 33px;
    margin: 0px 12px 0px 4px;
  }

  .sb-navigation {
    padding: 0px 4px;
  }

  .sb-nav {
    left: 0;
    padding: 0px 8px;
    width: 100%;
  }

  .sb-nav-item {
    width: 100%;
    list-style: none;
    line-height: 19px;
  }

  .sb-nav-item .icon {
    font-size: 16px;
    padding-left: 6px;
  }

  .sb-nav-item span {
    font-size: 14px;
  }

  .sb-nav-link {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    text-decoration: none;
    color: #c2c7d0;
    padding: 12px 12px;
    text-transform: capitalize;
  }

  .sb-nav-link:hover {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  .nav-link-active {
    color: #fff;
    background-color: #3c8dbc;
    border-radius: 4px;
  }

  .nav-child-active {
    color: #343a40;
    background-color: #ffffffe6;
    border-radius: 4px;
  }

  .sb-nav-link .icon {
    padding: 0px 6px 0px 6px;
  }

  .nav-child {
    padding-left: 0px;
  }

  .arrow {
    align-self: flex-end;
    margin-left: auto;
  }
`

export default SidebarStyled
