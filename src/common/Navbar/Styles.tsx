import styled from 'styled-components'

const NavbarStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  background-color: #17a2b8;
  padding: 12px 16px;
  border-style: solid;
  border-width: 1px 1px 0px 1px;

  .nav {
    list-style-type: none;
    margin: 0px;
    padding-left: 0px;
  }

  .nav-link {
    color: rgba(255, 255, 255, 0.75);
    font-size: 14px;
    display: inline;
    padding: 5.6px 8px;
    transition: 0.4s ease;
    border: none;
    background: transparent;
  }

  .nav-link:hover {
    color: rgba(255, 255, 255, 1);
  }

  .nav-button {
    color: inherit;
    background-color: inherit;
    border: none;
  }

  .popup {
    position: fixed;
    right: 10px;
    top: 47px;
    z-index: 3;
    text-align: center;
  }

  .popup div {
    padding: 10px 20px;
    width: 100%;
    border-bottom: solid 1px rgba(0, 0, 0, 0.1);
  }

  .popup > div:last-child {
    border-bottom: none;
  }

  .popup-option:hover {
    background-color: #d9230f;
  }

  .popup-option a,
  .popup-option button {
    text-decoration: none;
    color: rgba(0, 0, 0, 0.75);
    font-size: 14px;
    background: none;
    border: none;
  }

  .popup-title {
    font-weight: 700;
  }
`

export default NavbarStyled
