import styled from "styled-components";

const ListTableContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
  margin: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);

  overflow-x: scroll;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  table > tr:last-child {
    border-bottom: 0px;
  }

  tr:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.05);
  }

  a {
    color: #3c8dbc;
    text-decoration: none;
    font-weight: 700;
  }

  a:hover {
    color: #296282;
    text-decoration: underline;
  }

  .header {
    border-bottom: 2px solid #ccc;
  }

  .column {
    text-align: left;
    padding: 12px 24px 12px 12px;
    text-transform: capitalize;
  }

  .data {
    border-bottom: 1px solid #ccc;
  }

  .checkbox {
    width: 49px;
    padding: 12px 0px 12px 24px;
  }
  .checkbox input {
    margin: 0px;
  }
`

export default ListTableContainer


