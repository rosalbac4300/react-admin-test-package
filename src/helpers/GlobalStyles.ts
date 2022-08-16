import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  }
  
  .col-1 {
    width: 8.33%;
  }
  .col-2 {
    width: 16.66%;
  }
  .col-3 {
    width: 25%;
  }
  .col-4 {
    width: 33.33%;
  }
  .col-5 {
    width: 41.66%;
  }
  .col-6 {
    width: 50%;
  }
  .col-7 {
    width: 58.33%;
  }
  .col-8 {
    width: 66.66%;
  }
  .col-9 {
    width: 75%;
  }
  .col-10 {
    width: 83.33%;
  }
  .col-11 {
    width: 91.66%;
  }
  .col-12 {
    width: 100%;
  }
  @media (max-width: 992px) {
    .col-md-1 {
      width: 8.33%;
    }
    .col-md-2 {
      width: 16.66%;
    }
    .col-md-3 {
      width: 25%;
    }
    .col-md-4 {
      width: 33.33%;
    }
    .col-md-5 {
      width: 41.66%;
    }
    .col-md-6 {
      width: 50%;
    }
    .col-md-7 {
      width: 58.33%;
    }
    .col-md-8 {
      width: 66.66%;
    }
    .col-md-9 {
      width: 75%;
    }
    .col-md-10 {
      width: 83.33%;
    }
    .col-md-11 {
      width: 91.66%;
    }
    .col-md-12 {
      width: 100%;
    }
  }
  @media (max-width: 768px) {
    .col-sm-1 {
      width: 8.33%;
    }
    .col-sm-2 {
      width: 16.66%;
    }
    .col-sm-3 {
      width: 25%;
    }
    .col-sm-4 {
      width: 33.33%;
    }
    .col-sm-5 {
      width: 41.66%;
    }
    .col-sm-6 {
      width: 50%;
    }
    .col-sm-7 {
      width: 58.33%;
    }
    .col-sm-8 {
      width: 66.66%;
    }
    .col-sm-9 {
      width: 75%;
    }
    .col-sm-10 {
      width: 83.33%;
    }
    .col-sm-11 {
      width: 91.66%;
    }
    .col-sm-12 {
      width: 100%;
    }
  }
  @media (min-width: 992px) {
    .col-lg-1 {
      width: 8.33%;
    }
    .col-lg-2 {
      width: 16.66%;
    }
    .col-lg-3 {
      width: 25%;
    }
    .col-lg-4 {
      width: 33.33%;
    }
    .col-lg-5 {
      width: 41.66%;
    }
    .col-lg-6 {
      width: 50%;
    }
    .col-lg-7 {
      width: 58.33%;
    }
    .col-lg-8 {
      width: 66.66%;
    }
    .col-lg-9 {
      width: 75%;
    }
    .col-lg-10 {
      width: 83.33%;
    }
    .col-lg-11 {
      width: 91.66%;
    }
    .col-lg-12 {
      width: 100%;
    }
  }
  .row {
    display: flex;
    flex-wrap: wrap;
  }
  .row::after {
    content: '';
    clear: both;
    display: table;
  }
  .left {
    display: flex;
    flex-direction: row;
    justify-content: right;
  }
  .right {
    display: flex;
    flex-direction: row;
    justify-content: end;
  }
  .center {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
`

export default GlobalStyles