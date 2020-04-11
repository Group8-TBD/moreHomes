import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import faker from 'faker';

import RecHomeList from './RecHomeList.jsx';

const munge = (listings) => {
  const homes = listings.map((listing) => {
    return {
      "space": {
        "occupancy": listing.occupancy,
        "type": listing.type,
        "bedCount": listing.bed_count
      },
      "rate": {
        "price": listing.price,
        "timeframe": listing.timeframe
      },
      "review": {
        "stars": listing.avg_rtg,
        "reviewers": listing.num_reviews
      },
      "images": [],
      "_id": listing.id,
      'title': '',
      "description": listing.description
    };
  });

  return homes;
};

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
        let homeList = munge(results.data);
        this.setState({ homes: homeList });

        const newHomeList = [];
        // get images associated with listings
        homeList.forEach((home) => {
          axios.get(`/images/listing/${home._id}`)
            .then((allImages) => {
              let imageUrls = allImages.data.map(urlId =>
                `https://olympuscomponent.s3-us-west-1.amazonaws.com/${urlId.image_url_id}.jpg`
              );
              let newState = {};
              Object.assign(newState, home);
              newState.images = imageUrls;

              newHomeList.push(newState);
            });
        });

        return newHomeList;
      })
      .then((newState) => {
        this.setState({ homes: newState }, () => {
          console.log(this.state);
        })
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

  render() {

    return (
      <div>

        {this.state.homes ? <RecHomeList homesSet={this.state.homes} shift={this.state.shift} nexthome={this.nexthome} prevhome={this.prevhome} /> : <div>...loading</div>}

      </div>
    )
  }
}

export default App;