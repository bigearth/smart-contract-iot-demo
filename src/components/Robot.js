import React, { Component } from 'react'
import { connect } from 'mqtt';

class Robot extends Component {
  constructor(props) {
    super(props)

    this.state = {
      inMaintenanceMode: false
    }
  }

  componentWillMount() {
  }

  iotMsg(title, body, icon) {
    if(window.Notification && Notification.permission !== "denied") {
    	Notification.requestPermission(function(status) {  // status is "granted", if accepted by user
    		new Notification(title, {
    			body: body,
    			icon: icon // optional
    		});
    	});
    }
  }

  triggerIot(id) {

    // const client = connect(process.env.MQTT_URL);
    const client = connect("mqtts://jqpcdchr:scRzM1YSc4kh@m13.cloudmqtt.com:30805");
    client.on('connect', () => {
      client.subscribe(`clone/maintenance/${id}`);
      let msg = (this.props.robot.maintenance === 'false')  ? `Robot: ${name} EXITING maintenance mode` : `Robot: ${name}  ENTERING maintenance mode`;
      client.publish(`clone/maintenance/${id}`, msg);
      this.iotMsg('Sent', msg, '');
      // this.setState({
      //   mqttOutput: 'Broker Publishing: ' + msg
      // });
    })

    client.on('message', (topic, msg) => {
      this.iotMsg('Received', msg, '');
    //   this.setState({
    //     mqttOutput: 'Subscriber Receiving: ' + message
    //   });
      client.end()
    })
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
      this.props.reloadRobots();
      this.triggerIot(id);
      // this.setState({
      //   isLoading: false
      // });


      return CloneInstance.getNeedsMaintenance.call()
    }).then((result) => {
      if(result === true) {
         CloneInstance.setNeedsMaintenance(false, {from: this.props.account});
      }
    });
  }

  render() {
    let actionBtn;
    if(this.props.account !== this.props.robot.seller) {
      actionBtn = <li>
        <button onClick={this.buyRobot.bind(this, this.props.robot.id.toNumber(), this.props.robot.price)}>
          Buy
        </button>
    </li>;
    } else {
      actionBtn = <li>
        <button onClick={this.toggleMaintenanceMode.bind(this, this.props.robot.id.toNumber(), this.props.robot.name, this.props.robot.maintenance)}>
          Turn Maintenance Mode {this.props.robot.maintenance === 'false' ? 'ON' : 'OFF'}
        </button>
      </li>;
    }

    return (
      <div className="Robot">
        <ul>
          <li>Robot: <strong>{this.props.robot.name}</strong></li>
          <li>Price: <strong>{this.props.robot.price.toNumber()} ETH</strong></li>
          {actionBtn}
          <li>Owner: <strong>{this.props.account === this.props.robot.seller ? 'You' : this.props.robot.seller}</strong></li>
        </ul>
      </div>
    );
  }
}

export default Robot
