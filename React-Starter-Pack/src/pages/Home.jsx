import React from 'react'
import Banner from '../components/Home/Banner'
import Hero from '../components/Home/Hero'
import Features from '../components/Home/Features'
import Testimonial from '../components/Home/Testimonial'
import Calltoaction from '../components/Home/Calltoaction'
import Footer from '../components/Home/Footer'

const Home = () => {
  return (
    <div>
        <Banner/>
        <Hero/>
        <Features/>
        <Testimonial/>
        <Calltoaction/>
        <Footer/>
    </div>
  )
}

export default Home