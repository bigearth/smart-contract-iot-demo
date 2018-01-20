import React, { Component } from 'react'
import CloneContract from '../build/contracts/Clone.json'
import getWeb3 from './utils/getWeb3'
import { connect } from 'mqtt';
const contract = require('truffle-contract')
const Clone = contract(CloneContract)
let CloneInstance;

import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userName: 0x0,
      title: '',
      web3: null,
      Clone: '',
      inMaintenanceMode: false,
      maintenanceBtnDisabled: false,
      isLoading: false,
      balance: 0,
      mqttOutput: ''
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

    this.setState({
      Clone: Clone
    })
    Clone.setProvider(this.state.web3.currentProvider)

    // Listen for events
    this.listenToEvents();

    // Get account.
    this.state.web3.eth.getCoinbase((error, account) => {
      Clone.deployed().then((instance) => {
        CloneInstance = instance
        this.setState({
          userName: account
        })

        return CloneInstance.getTitle.call()
      }).then((result) => {
        this.setState({
          title: result
        });
        return CloneInstance.getNeedsMaintenance.call()
      }).then((result) => {
        this.setState({
          needsMaintenance: result
        });
        return CloneInstance.getInMaintenanceMode.call()
      }).then((result) => {
        this.setState({
          inMaintenanceMode: result
        });
      }).then((result) => {
        this.state.web3.eth.getBalance(account, (error, success) => {
          this.setState({
            balance: this.state.web3.fromWei(success, "ether").toNumber()
          })
          return CloneInstance.getTitle.call()
        });
      });
    });
  }

  toggleMaintenanceMode() {

    Clone.deployed().then((instance) => {
      this.setState({
        maintenanceBtnDisabled: true,
        isLoading: true,
        mqttOutput: ''
      });

      return CloneInstance.setInMaintenanceMode(!this.state.inMaintenanceMode, {from: this.state.userName});
    }).then((result) => {
      this.setState({
        inMaintenanceMode: !this.state.inMaintenanceMode,
        needsMaintenance: false,
        maintenanceBtnDisabled: false,
        isLoading: false
      });

      const client = connect(process.env.MQTT_URL);

      client.on('connect', () => {
        client.subscribe('clone/maintenance');
        let msg = this.state.inMaintenanceMode ? 'Robot: ' + this.state.title + ' ENTERING maintenance mode' : 'Robot: ' + this.state.title + ' EXITING from maintenance mode';
        client.publish('clone/maintenance', msg);
        this.setState({
          mqttOutput: 'Broker Publishing: ' + msg
        });
      })

      client.on('message', (topic, message) => {
        this.setState({
          mqttOutput: 'Subscriber Receiving: ' + message
        });
        client.end()
      })

      return CloneInstance.getNeedsMaintenance.call()
    }).then((result) => {
      if(result === true) {
         CloneInstance.setNeedsMaintenance(false, {from: this.state.userName});
      }
    });
  }

  // Listen for events raised from the contract
  listenToEvents() {
    Clone.deployed().then((instance) => {
      instance.titleEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch((error, event) => {
        // console.log('event', event);
        // App.reloadArticles();
      });

      instance.generationEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch((error, event) => {
        // console.log('event', event);
        // App.reloadArticles();
      });

      instance.printEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch((error, event) => {
        // console.log('event', event);
        // App.reloadArticles();
      });

      instance.needsMaintenanceEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch((error, event) => {
        // console.log('event', event);
        // App.reloadArticles();
      });

      instance.inMaintenanceModeEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch((error, event) => {
        // console.log('event', event);
        // App.reloadArticles();
      });
    });
  }

  render() {
    let maintenanceToggleBtnState;
    let inMaintenanceMode;
    if(this.state.inMaintenanceMode) {
      maintenanceToggleBtnState = 'OFF';
      inMaintenanceMode = <p className='success'>{this.state.title} is in maintenance mode</p>;
    } else {
      maintenanceToggleBtnState = 'ON';
    }

    let needsMaintenance;
    if(this.state.needsMaintenance) {
      needsMaintenance = <p className='danger'>{this.state.title} needs maintenance</p>;
    }

    let loader;
    if(this.state.isLoading) {
      loader = <div className="loader"></div>;
    }

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">Smart Contract & IoT demo</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Account: {this.state.userName}</h1>
              <p>Balance: {this.state.balance} ETH</p>
              <h2>Robot</h2>
              <p>Name: {this.state.title}</p>
              <button onClick={this.toggleMaintenanceMode.bind(this, maintenanceToggleBtnState)} disabled={this.state.maintenanceBtnDisabled}>
                Turn Maintenance Mode {this.state.inMaintenanceMode === true ? 'OFF' : 'ON'}
              </button>
              {needsMaintenance}
              {inMaintenanceMode}
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
