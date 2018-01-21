import React, { Component } from 'react'

class Robot extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  componentWillMount() {
  }

  render() {
                  // {actionBtn}
                  // <li>Owner: <strong>{this.state.userName === this.props.seller ? 'You' : this.props.seller}</strong></li>

    return (
      <div className="App">
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <section>
                <ul>
                  <li>Robot: <strong>{this.props.robot.name}</strong></li>
                  <li>Price: <strong>{this.props.robot.price.toNumber()} ETH</strong></li>
                </ul>
              </section>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default Robot
