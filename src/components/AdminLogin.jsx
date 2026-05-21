import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function AdminLogin({ onCancel }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) setError(error.message)
  }

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      borderRadius: '16px',
      padding: '30px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      animation: 'slideInRight 0.6s ease-out'
    }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🔐</div>
        <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Admin Login</h2>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          color: '#fca5a5',
          padding: '12px',
          borderRadius: '10px',
          marginBottom: '15px',
          fontSize: '0.9rem',
          animation: 'slideInUp 0.5s ease-out',
          backdropFilter: 'blur(10px)'
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '12px 16px',
            marginBottom: '15px',
            borderRadius: '10px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#e2e8f0',
            fontSize: '1rem',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.08)'
            e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'
            e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.05)'
            e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'
            e.target.style.boxShadow = 'none'
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '12px 16px',
            marginBottom: '20px',
            borderRadius: '10px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#e2e8f0',
            fontSize: '1rem',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.08)'
            e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'
            e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.05)'
            e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'
            e.target.style.boxShadow = 'none'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 28px',
            background: loading ? 'rgba(139, 92, 246, 0.5)' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
            transition: 'all 0.3s ease',
            marginBottom: '10px'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.6)'
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)'
            }
          }}
        >
          {loading ? '⏳ Signing in...' : '✨ Sign In'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            width: '100%',
            padding: '12px 28px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#e2e8f0',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.15)'
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
            e.target.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)'
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  )
}