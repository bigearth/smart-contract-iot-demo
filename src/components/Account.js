import React, { Component } from 'react'

class Account extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  componentWillMount() {
  }

  render() {

    return (
      <div className="Account">
        <h1>Account: {this.props.account}</h1>
        <p>Balance: {this.props.balance} ETH</p>
      </div>
    );
  }
}

export default Account
