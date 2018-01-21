import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import App from './App'
import Account from './components/Account'


    // <div>
    //   <nav className="navbar pure-menu pure-menu-horizontal">
    //     <a href="/" className="pure-menu-heading pure-menu-link">Smart Contract & IoT demo</a>
    //     <a href="/accounts/" className="pure-menu-heading pure-menu-link right">Account: </a>
    //   </nav>
    //   <Route path="/accounts/:account_id" component={Account}/>
    //   <Route path="/" component={App}/>
    // </div>
ReactDOM.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>,
  document.getElementById('root')
);

// const Home = () => (
//   <div>
//     <nav>
//       <Link to="/">Homepage</Link>
//     </nav>
//
//     <div>
//       <Route path="/" component={App}/>
//     </div>
//   </div>
// );
