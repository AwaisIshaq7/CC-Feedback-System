import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import FeedbackForm from './components/FeedbackForm'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import './App.css'

function App() {
  const [session, setSession] = useState(undefined) // undefined = loading
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        if (session) setShowLogin(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Still loading
  if (session === undefined) {
    return (
      <div className="loading-container">
        <div style={{ textAlign: 'center' }}>
          <div className="loading-text">Loading...</div>
        </div>
      </div>
    )
  }

  // Admin is signed in
  if (session) {
    return <AdminDashboard session={session} />
  }

  // Public view with side layout
  return (
    <div className="app-container">
      {/* Main Feedback Section */}
      <div className="feedback-section">
        <FeedbackForm />
      </div>

      {/* Admin Section - Prominent on the side */}
      <div className="admin-section">
        {!showLogin ? (
          <div className="glass-container" style={{ padding: '30px', textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🔐</div>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Admin Access</h2>
              <p style={{ fontSize: '0.9rem', color: 'rgba(226, 232, 240, 0.7)', marginBottom: '25px' }}>
                Sign in to view and manage all feedback
              </p>
            </div>
            <button
              onClick={() => setShowLogin(true)}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              Login to Dashboard
            </button>
          </div>
        ) : (
          <AdminLogin onCancel={() => setShowLogin(false)} />
        )}
      </div>
    </div>
  )
}

export default App