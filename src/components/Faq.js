import React, { Component } from 'react'

class Faq extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  componentWillMount() {
  }

  render() {

    return (
      <div className="Faq">
        <h1>Frequently Asked Questions</h1>
        <h2>What is this?</h2>
        <p>BotMaker lets you create bots which live on the <a href='https://www.ethereum.org/'>Ethereum</a> blockchain. They are unable to be destroyed and are completely unique to you. You can also have your bots communicate w/ real bots in the real world over the Internet of Things using the MQTT protocol.</p>
        <h2>What do I need to make it work?</h2>
        <ul>
          <li><a href='https://www.google.com/chrome/browser/desktop/index.html'>Chrome Browser</a></li>
          <li><a href='https://metamask.io/'>Metamask Chrome extension</a></li>
          <li>Some ETH. You can purchase some at <a href='https://www.coinbase.com/'>Coinbase</a></li>
        </ul>
        <h2>How does it work?</h2>
        <p>This is a dapp (distributed app) which lives on the Ethereum blocchain. First you create an account using metamask. You then pay gas to create your bot. You can set a name and price. Finally you can browse other bots and even purchase them.</p>
      </div>
    );
  }
}

export default Faq
