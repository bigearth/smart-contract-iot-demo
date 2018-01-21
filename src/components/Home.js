import React, { Component } from 'react';
import Account from './Account';

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  componentWillMount() {
  }

  render() {

    return (
      <div className="Home">
        <Account account={this.props.account} balance={this.props.balance}/>
      </div>
    );
  }
}

export default Home
