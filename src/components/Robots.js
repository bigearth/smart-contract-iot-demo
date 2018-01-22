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



  render() {
    let robotRows;
    if(this.props.robots.length) {
      robotRows = [];
      this.props.robots.forEach((robot, index) => {
        let robotRow = <Robot robot={robot} account={this.props.account} clone={this.props.clone} reloadRobots={this.reloadRobots.bind(this)}  web3={this.props.web3}/>;
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
