import styled from 'styled-components'

const DashboardStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;

  .body {
    width: 100%;
  }

  .actions {
    font-size: 24px;
    font-weight: 400;
    text-transform: capitalize;
    margin: 0px 0px 0px 12px;
    padding: 0px 0px 6px 12px;
  }

  .actions-history {
    margin: 0px 0px 0px 12px;
    padding: 0px 0px 0px 12px;
  }

  table {
    border-collapse: collapse;
  }

  tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }

  td {
    padding: 4.8px;
    vertical-align: center;
  }

  table > tbody > tr:last-child {
    border-bottom: 0px;
  }

  table .link {
    color: #3c8dbc;
    text-decoration: none;
    text-transform: capitalize;
  }

  .link:hover {
    color: #296282;
    text-decoration: underline;
  }

  .buttons {
    float: right;
  }

  .circle-blue {
    width: fit-content;
    background-color: #007bff;
    color: #fff;
    padding: 6px;
    border-radius: 15px;
    font-size: 16px;
    margin: 0px auto 0px auto;
  }

  .timeline-card {
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    margin: 0px 35px 15px 0px;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
  }

  .timeline-card a {
    color: #3c8dbc;
    font-size: 16px;
    text-decoration: none;
    font-weight: 700;
  }

  .time {
    color: #999;
    float: right;
    font-size: 12px;
  }

  .timeline-card-header {
    display: flex;
    flex: wrap;
    padding: 6px 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .timeline-card-body {
    padding: 6px 12px;
    color: #333;
  }

  .timeline-card-body span {
    font-weight: 700;
  }
`

export default DashboardStyled
