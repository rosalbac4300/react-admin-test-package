import styled from "styled-components"

const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
  width: 100%;

  .text-field {
    height: calc(2.25rem + 2px);
    font-size: 1rem;
    font-weight: 400;
    color: #495057;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ced4da;
    width: 200px;
    margin: 6px 6px;
    padding: 6px 12px;
  }

  .table-col {
    text-align: center;
  }

  .table-header {
    font-weight: 700;
    padding: 12px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.2);
  }

  .table-row {
    padding: 12px 0px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }

  .table-row:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .icon-green {
    color: #469408;
    font-size: 14px;
  }

  .divide {
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }

  .form-info {
    text-align: center;
    padding: 6px 0px 16px 0px;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
  }
`

export default ListContainer