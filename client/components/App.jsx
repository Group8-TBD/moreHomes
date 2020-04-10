import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import faker from 'faker';

import RecHomeList from './RecHomeList.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      homes: null,
      shift: 0,
    }
    this.nexthome = this.nexthome.bind(this);
    this.prevhome = this.prevhome.bind(this);
  }

  componentDidMount() {
    const zip = '10000';
    //fetches set of eight homes for display in widget
    axios.get(`/recommendations/${zip}`)
      .then((results) => {
        console.log(results.data);
        this.setState({homes: results.data});
        console.log('data set: ', this.state.homes);
      })
      .catch((err) => {
        console.log('something went awry');
      })
    //_______________________________________________
  }

  nexthome() {
    this.setState({
      shift: this.state.shift + 1
    })
  }

  prevhome() {
    this.setState({
      shift: this.state.shift - 1
    })
  }

  render () {

      return (
        <div>

          {this.state.homes ? <RecHomeList homesSet={this.state.homes} shift={this.state.shift} nexthome={this.nexthome} prevhome={this.prevhome} /> : <div>...loading</div>}

        </div>
      )
  }
}

export default App;