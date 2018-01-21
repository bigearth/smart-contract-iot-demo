import React, { Component } from 'react'

class CreateRobot extends Component {
  constructor(props) {
    super(props)

    this.state = {
      robotName: '',
      robotPrice: ''
    }
  }

  componentWillMount() {
  }

  handleRobotNameChange(e) {
   this.setState({robotName: e.target.value});
  }

  handleRobotPriceChange(e) {
   this.setState({robotPrice: e.target.value});
  }

  createRobot() {
    // this.setState({
    //   isLoading: true
    // });
    if ((this.state.robotName.trim() === '') || (this.state.robotPrive === 0)) {
      // nothing to create
      return false;
    }

    this.props.clone.deployed().then((instance) => {
      return instance.createRobot(this.state.robotName, +this.state.robotPrice, {
        from: this.props.account,
        gas: 500000
      });
    }).then((result) => {
      this.setState({
        robotName: '',
        robotPrice: '',
        // isLoading: false
      })
      this.props.reloadRobots();
    }).catch((err) => {
      console.error(err);
    });
  }

  render() {
    return (
      <div className="CreateRobot">
        <h2>Create New Robot</h2>
        <p id='newRobotName'>Name: <input type='text' placeholder="Robot Name" value={this.state.robotName} onChange={this.handleRobotNameChange.bind(this)} /></p>
        <p id='newRobotPrice'>Price: <input type='number' placeholder="Robot Price" value={this.state.robotPrice} onChange={this.handleRobotPriceChange.bind(this)} /></p>
        <button onClick={this.createRobot.bind(this)}>Create</button>
      </div>
    );
  }
}

export default CreateRobot
