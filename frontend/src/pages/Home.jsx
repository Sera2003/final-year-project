import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import AIRecommendations from '../components/AIRecommendations'

const Home = () => {
  return (
    <div>
      <Hero />

      {/* ✅ NEW: FYP Features Section (AI + Try-On) */}
      <section className="mt-10 px-4">
        <div className="grid gap-6 sm:grid-cols-2">

          {/* AI Virtual Stylist */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold">AI Virtual Stylist</h2>
            <p className="text-gray-600 mt-2">
              Get personalized outfit recommendations based on your preferences and browsing.
            </p>
            <Link to="/ai-stylist">
              <button className="mt-4 bg-black text-white px-5 py-2 text-sm">
                Start Recommendations
              </button>
            </Link>
          </div>

          {/* Virtual Try-On */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold">Virtual Try-On</h2>
            <p className="text-gray-600 mt-2">
              Upload your photo and preview how outfits look on you before buying.
            </p>
<Link to="/collection?tryon=true">
  <button className="mt-4 bg-black text-white px-5 py-2 text-sm">
    Try It On
  </button>
</Link>
          </div>

        </div>
      </section>

      <AIRecommendations />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsletterBox />
    </div>
  )
}

export default Home
