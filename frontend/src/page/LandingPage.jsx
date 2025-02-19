import { Link } from "react-router-dom"
import { FaHandHoldingHeart, FaUtensils, FaLeaf, FaUsers } from "react-icons/fa"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-myorange to-amber-100 font-times">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
        <div className="text-3xl font-bold text-gray-600">SLC</div>
        
      </header>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-16">
        <div className="bg-white w-full max-w-5xl rounded-xl p-8 shadow-lg opacity-95 text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 text-myorange">Serve Leftover with Care</h1>
          <p className="text-2xl sm:text-3xl mb-8 text-gray-700">
            Join our mission to reduce food waste and feed those in need
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            <div className="bg-amber-50 p-6 rounded-lg shadow-md">
              <FaHandHoldingHeart className="text-5xl text-myorange mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Donate Food</h2>
              <p className="mb-4">Share your excess food and make a difference in someone's life.</p>
              <Link
                to="/donate/sign-in"
                className="bg-gray-900 text-white text-xl font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-300 inline-block"
              >
                Start Donating
              </Link>
            </div>
            <div className="bg-amber-50 p-6 rounded-lg shadow-md">
              <FaUtensils className="text-5xl text-myorange mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Get Food</h2>
              <p className="mb-4">Access nutritious meals and reduce food insecurity in your community.</p>
              <Link
                to="/User/sign-in"
                className="bg-gray-900 text-white text-xl font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-300 inline-block"
              >
                Find Food
              </Link>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Why Choose SLC?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <FaLeaf className="text-4xl text-green-500 mb-2" />
                <h3 className="text-xl font-semibold mb-2">Reduce Waste</h3>
                <p>Help minimize food waste and its environmental impact</p>
              </div>
              <div className="flex flex-col items-center">
                <FaUsers className="text-4xl text-blue-500 mb-2" />
                <h3 className="text-xl font-semibold mb-2">Build Community</h3>
                <p>Connect with others and strengthen local bonds</p>
              </div>
              <div className="flex flex-col items-center">
                <FaHandHoldingHeart className="text-4xl text-red-500 mb-2" />
                <h3 className="text-xl font-semibold mb-2">Make an Impact</h3>
                <p>Directly contribute to reducing hunger in your area</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-100 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
            <p className="mb-4">Sign up for our newsletter to stay updated on our initiatives and how you can help.</p>
            <form className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg border-2 border-amber-300 focus:outline-none focus:border-myorange w-full sm:w-auto"
              />
              <button
                type="submit"
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      
    </div>
  )
}

