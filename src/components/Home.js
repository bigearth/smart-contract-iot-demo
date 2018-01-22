import React, { Component } from 'react';
import Account from './Account';
import CreateRobot from './CreateRobot';
import Robots from './Robots';

class Home extends Component {
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
    return (
      <div className="Home">
        <h1>BotMaker</h1>
        <p>Create and sell your own unique robots which live on the blockchain. Have them send signals to physical robots on the Internet of Things</p>
        <Account account={this.props.account} balance={this.props.balance}/>
        <CreateRobot clone={this.props.clone} account={this.props.account} reloadRobots={this.reloadRobots.bind(this)} web3={this.props.web3}/>
        <Robots clone={this.props.clone} wei3={this.props.web3} robots={this.props.robots} account={this.props.account} reloadRobots={this.reloadRobots.bind(this)} web3={this.props.web3}/>
      </div>
    );
  }
}

export default Home
