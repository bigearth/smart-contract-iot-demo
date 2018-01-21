import React, { Component } from 'react'
import Robot from './Robot';

class Robots extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  componentWillMount() {
  }

  buyRobot(robotId, price) {
    console.log(price.toNumber());

    this.props.clone.deployed().then((instance) => {
      return instance.buyRobot(robotId, {
        from: this.props.account,
        value: this.props.web3.toWei(price, "ether"),
        gas: 500000
      });
    }).then((result) => {
      // this.reloadRobots();

    }).catch((err) => {
      console.error(err);
    });
  }

  toggleMaintenanceMode(id, name, inMaintenanceMode) {

    let CloneInstance;
    this.props.clone.deployed().then((instance) => {
      CloneInstance = instance;

      // this.setState({
      //   isLoading: true,
      //   mqttOutput: ''
      // });

      if(inMaintenanceMode === false || inMaintenanceMode === 'false') {
        inMaintenanceMode = true;
      } else {
        inMaintenanceMode = false;
      }

      return CloneInstance.setInMaintenanceMode(id, inMaintenanceMode, {from: this.props.account});
    }).then((result) => {
      // this.reloadRobots();
      // this.setState({
      //   isLoading: false
      // });

      // const client = connect(process.env.MQTT_URL);
      // client.on('connect', () => {
      //   client.subscribe('clone/maintenance/' + id);
      //   let msg = this.state.inMaintenanceMode ? 'Robot: ' + name + ' ENTERING maintenance mode' : 'Robot: ' + name + ' EXITING from maintenance mode';
      //   client.publish('clone/maintenance/' + id, msg);
      //   this.setState({
      //     mqttOutput: 'Broker Publishing: ' + msg
      //   });
      // })
      //
      // client.on('message', (topic, message) => {
      //   this.setState({
      //     mqttOutput: 'Subscriber Receiving: ' + message
      //   });
      //   client.end()
      // })

      return CloneInstance.getNeedsMaintenance.call()
    }).then((result) => {
      if(result === true) {
         CloneInstance.setNeedsMaintenance(false, {from: this.props.account});
      }
    });
  }

  render() {
    let robotRows;
    if(this.props.robots.length) {
      robotRows = [];
      this.props.robots.forEach((robot, index) => {
        let actionBtn;
        if(this.props.account !== robot.seller) {
          actionBtn = <li>
            <button onClick={this.buyRobot.bind(this, robot.id.toNumber(), robot.price)}>
              Buy
            </button>
        </li>;
        } else {
          actionBtn = <li>
            <button onClick={this.toggleMaintenanceMode.bind(this, robot.id.toNumber(), robot.name, robot.maintenance)} disabled={this.maintenance}>
              Turn Maintenance Mode {robot.maintenance === 'false' ? 'ON' : 'OFF'}
            </button>
          </li>;
        }

        let robotRow = <Robot robot={robot}/>;
        robotRows.push(robotRow);
      });
    }

    return (
      <div className="Robots">
        <h2>Robots</h2>
        {robotRows}
      </div>
    );
  }
}

export default Robots
