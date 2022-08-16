import styled from 'styled-components'

const HeaderStyled = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  margin: 0 25px;

  .title {
    font-size: 24px;
    font-weight: 400;
    text-transform: capitalize;
  }

  .breadcrumbs {
    display: flex;
    align-items: center;
    justify-content: end;
  }

  .breadcrumb {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    padding: 3px 3px 3px 0px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  .breadcrumb > li:last-child .breadcrumb-divide {
    display: none;
  }

  .breadcrumb-item {
    color: #3c8dbc;
    text-decoration: none;
    padding: 0px 4px 0px 8px;
  }

  .breadcrumb-item:hover {
    color: #296282;
    text-decoration: underline;
  }

  .breadcrumb-item:visited {
    color: #3c8dbc;
    text-decoration: none;
  }
`

export default HeaderStyled
