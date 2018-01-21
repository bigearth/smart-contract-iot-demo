import React, { Component } from 'react';
import CloneContract from '../build/contracts/Clone.json';
import getWeb3 from './utils/getWeb3';
import Home from './components/Home';
import Robot from './components/Robot';
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

  toggleMaintenanceMode(id, name, inMaintenanceMode) {

    Clone.deployed().then((instance) => {
      this.setState({
        isLoading: true,
        mqttOutput: ''
      });

      if(inMaintenanceMode === false || inMaintenanceMode === 'false') {
        inMaintenanceMode = true;
      } else {
        inMaintenanceMode = false;
      }

      return CloneInstance.setInMaintenanceMode(id, inMaintenanceMode, {from: this.state.account});
    }).then((result) => {
      this.reloadRobots();
      this.setState({
        isLoading: false
      });

      const client = connect(process.env.MQTT_URL);
      client.on('connect', () => {
        client.subscribe('clone/maintenance/' + id);
        let msg = this.state.inMaintenanceMode ? 'Robot: ' + name + ' ENTERING maintenance mode' : 'Robot: ' + name + ' EXITING from maintenance mode';
        client.publish('clone/maintenance/' + id, msg);
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
         CloneInstance.setNeedsMaintenance(false, {from: this.state.account});
      }
    });
  }

  createRobot() {
    this.setState({
      isLoading: true
    });
    if ((this.state.robotName.trim() === '') || (this.state.robotPrive === 0)) {
      // nothing to create
      return false;
    }

    Clone.deployed().then((instance) => {
      return instance.createRobot(this.state.robotName, +this.state.robotPrice, {
        from: this.state.account,
        gas: 500000
      });
    }).then((result) => {
      this.setState({
        robotName: '',
        robotPrice: '',
        isLoading: false
      })
      this.reloadRobots();
    }).catch((err) => {
      console.error(err);
    });
  }

  buyRobot(robotId, price) {
    console.log(price.toNumber());

    Clone.deployed().then((instance) => {
      return instance.buyRobot(robotId, {
        from: this.state.account,
        value: this.state.web3.toWei(price, "ether"),
        gas: 500000
      });
    }).then((result) => {
      this.reloadRobots();

    }).catch((err) => {
      console.error(err);
    });
  }

  handleRobotNameChange(e) {
   this.setState({robotName: e.target.value});
  }

  handleRobotPriceChange(e) {
   this.setState({robotPrice: e.target.value});
  }

  render() {

    let loader;
    if(this.state.isLoading) {
      loader = <div className="loader"></div>;
    }

    let robotRows;
    if(this.state.robots.length) {
      robotRows = [];
      this.state.robots.forEach((item, index) => {
        let actionBtn;
        if(this.state.account !== item.seller) {
          actionBtn = <li>
            <button onClick={this.buyRobot.bind(this, item.id.toNumber(), item.price)}>
              Buy
            </button>
        </li>;
        } else {
          actionBtn = <li>
            <button onClick={this.toggleMaintenanceMode.bind(this, item.id.toNumber(), item.name, item.maintenance)} disabled={this.maintenance}>
              Turn Maintenance Mode {item.maintenance === 'false' ? 'ON' : 'OFF'}
            </button>
          </li>;
        }

        let robotRow = <Robot robot={item}/>;
        robotRows.push(robotRow);
      });
    }

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="/" className="pure-menu-heading pure-menu-link">Smart Contract & IoT demo</a>
          <a href="/accounts/:account_id" className="pure-menu-heading pure-menu-link right">Account: {this.state.account}</a>
        </nav>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-2">
              <Home account={this.state.account} balance={this.state.balance}/>
              <h2>Create New Robot</h2>
              <p id='newName'>Name: <input type='text' placeholder="Robot Name" value={this.state.robotName} onChange={this.handleRobotNameChange.bind(this)} /></p>
              <p id='newPrice'>Price: <input type='number' placeholder="Robot Price" value={this.state.robotPrice} onChange={this.handleRobotPriceChange.bind(this)} /></p>
              <button onClick={this.createRobot.bind(this)}>Create</button>
              <h2>Robots</h2>
              {robotRows}
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
