import React, { Component } from 'react';
import CloneContract from '../build/contracts/Clone.json';
import getWeb3 from './utils/getWeb3';
import Home from './components/Home';
import Robots from './components/Robots';
import Robot from './components/Robot';
import CreateRobot from './components/CreateRobot';
import { connect } from 'mqtt';
const contract = require('truffle-contract');
const Clone = contract(CloneContract);
let CloneInstance;

import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      account: 0x0,
      web3: null,
      Clone: '',
      isLoading: false,
      balance: 0,
      mqttOutput: '',
      robots: [],
      robotName: '',
      robotPrice: ''
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
      this.displayAccountInfo();
      this.instantiateContract();
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  displayAccountInfo() {
    // Get account.
    this.state.web3.eth.getCoinbase((err, account) => {
      if(err === null) {
        Clone.deployed().then((instance) => {
          CloneInstance = instance
          this.setState({
            account: account
          })
          this.state.web3.eth.getBalance(account, (error, success) => {
            this.setState({
              balance: this.state.web3.fromWei(success, "ether").toNumber()
            })
          });
        });
      }
    });
  }

  instantiateContract() {

    this.setState({
      Clone: Clone
    })
    Clone.setProvider(this.state.web3.currentProvider)

    // Listen for events
    this.listenToEvents();

    return this.reloadRobots();
  }
  // Listen for events raised from the contract
  listenToEvents() {
    Clone.deployed().then((instance) => {
      instance.generationEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch((error, event) => {
        // App.reloadRobots();
      });

      instance.printEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch((error, event) => {
        // App.reloadRobots();
      });

      instance.needsMaintenanceEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch((error, event) => {
        // App.reloadRobots();
      });

      instance.inMaintenanceModeEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch((error, event) => {
        // App.reloadRobots();
      });

      instance.createRobotEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch((error, event) => {
        // this.reloadRobots();
      });
    });
  }

  reloadRobots() {
    // refresh account information because the balance may have changed
    this.displayAccountInfo();

    let cloneInstance;
    //
    Clone.deployed().then((instance) => {
      cloneInstance = instance;
      return cloneInstance.getRobotsForSale();
    }).then((robotIds) => {
      let bots = [];
      for (let i = 0; i < robotIds.length; i++) {
        let robotId = robotIds[i];
        cloneInstance.robots(robotId).then((robot) => {
          bots.push({
            id: robot[0],
            seller: robot[1],
            name: robot[3],
            price: robot[4],
            maintenance: robot[5].toString()
          })
        }).then((result) => {
          this.setState({
            robots: bots
          });
        });
      }
    }).catch(function(err) {
    });
  }


  render() {

    let loader;
    if(this.state.isLoading) {
      loader = <div className="loader"></div>;
    }

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="/" className="pure-menu-heading pure-menu-link">Smart Contract & IoT demo</a>
          <a href={"/accounts/" + this.state.account}  className="pure-menu-heading pure-menu-link right">Account: {this.state.account}</a>
        </nav>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-2">
              <Home balance={this.state.balance} account={this.state.account}/>
              <CreateRobot clone={this.state.Clone} account={this.state.account} reloadRobots={this.reloadRobots.bind(this)}/>
              <Robots clone={this.state.Clone} wei3={this.state.web3} robots={this.state.robots} account={this.state.account}/>
            </div>
            <div className="pure-u-1-2">
              <p>IoT Console:</p>
              <p id='mqttConsole'>
                {this.state.mqttOutput}
              </p>
              {loader}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
