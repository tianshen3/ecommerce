import React from 'react'
import Hero from "../components/Hero.jsx";
import LatestCollection from '../components/LatestCollection.jsx';
import BestSeller from '../components/BestSeller.jsx';

function Home() {
  return (
    <div>
      <Hero/>
      <LatestCollection/>
      <BestSeller/>
    </div>
  )
}

export default Home;
