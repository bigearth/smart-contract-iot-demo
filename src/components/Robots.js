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

  reloadRobots() {
    this.props.reloadRobots();
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


  render() {
    let robotRows;
    if(this.props.robots.length) {
      robotRows = [];
      this.props.robots.forEach((robot, index) => {
        let robotRow = <Robot robot={robot} account={this.props.account} clone={this.props.clone} reloadRobots={this.reloadRobots.bind(this)}/>;
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
