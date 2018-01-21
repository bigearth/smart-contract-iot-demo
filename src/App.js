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
      web3: null,
      Clone: '',
      inMaintenanceMode: false,
      maintenanceBtnDisabled: false,
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
            userName: account
          })
          this.state.web3.eth.getBalance(account, (error, success) => {
            this.setState({
              balance: this.state.web3.fromWei(success, "ether").toNumber()
            })

            // return CloneInstance.getTitle.call()
          });

          // return CloneInstance.getTitle.call()
        // }).then((result) => {
        //   // return CloneInstance.getNeedsMaintenance.call()
        // }).then((result) => {
        //   // this.setState({
        //   //   needsMaintenance: result
        //   // });
        //   // return CloneInstance.getInMaintenanceMode.call()
        // }).then((result) => {
        //   // this.setState({
        //   //   inMaintenanceMode: result
        //   // });
        // }).then((result) => {
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
      // Retrieve and clear the robot placeholder
    //   // var robotsRow = $('#robotsRow');
    //   // robotsRow.empty();
    //
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
    //   // App.loading = false;
    }).catch(function(err) {
    //   App.loading = false;
    });
  }

  toggleMaintenanceMode(id, name, inMaintenanceMode) {

    Clone.deployed().then((instance) => {
      this.setState({
        isLoading: true,
        mqttOutput: ''
      });

      if(inMaintenanceMode == false || inMaintenanceMode == 'false') {
        inMaintenanceMode = true;
      } else {
        inMaintenanceMode = false;
      }

      return CloneInstance.setInMaintenanceMode(id, inMaintenanceMode, {from: this.state.userName});
    }).then((result) => {
      this.reloadRobots();
      this.setState({
        isLoading: false
      });

      const client = connect(process.env.MQTT_URL);
      //
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
         CloneInstance.setNeedsMaintenance(false, {from: this.state.userName});
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
        from: this.state.userName,
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
        from: this.state.userName,
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

    let robotRows;
    if(this.state.robots.length) {
      robotRows = [];
      this.state.robots.forEach((item, index) => {
        let actionBtn;
        if(this.state.userName !== item.seller) {
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

        let robotRow = <section>
          <ul>
            <li>Robot: <strong>{item.name}</strong></li>
            <li>Price: <strong>{item.price.toNumber()} ETH</strong></li>
            <li>Owner: <strong>{this.state.userName === item.seller ? 'You' : item.seller}</strong></li>
            {actionBtn}
          </ul>
        </section>;
        robotRows.push(robotRow);
      });
    }

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">Smart Contract & IoT demo</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-2">
              <h1>Account: {this.state.userName}</h1>
              <p>Balance: {this.state.balance} ETH</p>
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
