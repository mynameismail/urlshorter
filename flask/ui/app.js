'use strict'

const e = React.createElement

class HelloButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = { liked: false }
  }

  render() {
    if (this.state.liked) {
      return 'Hello from Urlshorter'
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Hello'
    )
  }
}

const appContainer = document.querySelector('#app')
ReactDOM.render(e(HelloButton), appContainer)
