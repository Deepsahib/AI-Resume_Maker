import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Banner from '../components/Home/Banner'
import Hero from '../components/Home/Hero'
import Features from '../components/Home/Features'
import Testimonial from '../components/Home/Testimonial'
import Calltoaction from '../components/Home/Calltoaction'
import Footer from '../components/Home/Footer'

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <div>
        {/* Welcome Message for Logged In Users */}
        {isLoggedIn && (
          <div className="bg-green-50 border-b border-green-200 py-3 px-4 text-center">
            <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
              <span className="text-green-800">
                Welcome back, <strong>{user?.name}</strong>! 
              </span>
              <Link 
                to="/app" 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
        
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