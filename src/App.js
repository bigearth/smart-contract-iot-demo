import React, { Component } from 'react'
import CloneContract from '../build/contracts/Clone.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userName: '',
      title: '',
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const Clone = contract(CloneContract)
    Clone.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on clone.
    var CloneInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      Clone.deployed().then((instance) => {
        CloneInstance = instance
        this.setState({
          userName: accounts[0],
          balance: this.state.web3.fromWei(this.state.web3.eth.getBalance(accounts[0]), "ether").toNumber()
        })

        return CloneInstance.setTitle('Clone EARTH', {from: accounts[0]})
      }).then((result) => {
        return CloneInstance.getTitle.call(accounts[0])
      }).then((result) => {
        this.setState({
          title: result
        });
        return CloneInstance.getNeedsMaintenance.call(accounts[0])
      }).then((result) => {
        this.setState({
          needsMaintenance: result
        });
        return CloneInstance.getIsBeingRepaired.call(accounts[0])
      }).then((result) => {
        this.setState({
          isBeingRepaired: result
        });
      });
    });
  }

  render() {
    let needsMaintenance;
    let isBeingRepaired;
    if(this.state.needsMaintenance) {
      needsMaintenance = <p>needs maintenance</p>;
    }
    if(this.state.isBeingRepaired) {
      isBeingRepaired = <p>Is being repaired</p>;
    }
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">my.clone.earth</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Account: {this.state.userName}</h1>
              <p>Balance: {this.state.balance} ETH</p>
              <h2>Clone</h2>
              <p>{this.state.title}</p>
              {needsMaintenance}
              {isBeingRepaired}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
