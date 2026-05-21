import { useState } from 'react'
import { supabase } from '../supabaseClient'

const CATEGORIES = ['General', 'Bug Report', 'Feature Request', 'Complaint', 'Appreciation']

export default function FeedbackForm() {
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('General')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    setLoading(true)
    setError('')

    const { error } = await supabase
      .from('feedback')
      .insert([{ message: message.trim(), category }])

    setLoading(false)

    if (error) {
      setError('Failed to submit. Please try again.')
    } else {
      setSuccess(true)
      setMessage('')
      setCategory('General')
      setTimeout(() => setSuccess(false), 4000)
    }
  }

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      borderRadius: '16px',
      padding: '40px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      animation: 'slideInUp 0.8s ease-out'
    }}>
      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>📬</div>
      </div>
      <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Share Your Feedback</h1>
      <p style={{ fontSize: '1rem', color: 'rgba(226, 232, 240, 0.7)', marginBottom: '30px' }}>
        Help us improve by sharing your thoughts. Your feedback is completely anonymous.
      </p>

      {success && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.5)',
          color: '#86efac',
          padding: '16px',
          borderRadius: '10px',
          marginBottom: '20px',
          textAlign: 'center',
          animation: 'slideInUp 0.5s ease-out',
          backdropFilter: 'blur(10px)'
        }}>
          ✅ Thank you! Your feedback has been submitted.
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          color: '#fca5a5',
          padding: '16px',
          borderRadius: '10px',
          marginBottom: '20px',
          animation: 'slideInUp 0.5s ease-out',
          backdropFilter: 'blur(10px)'
        }}>
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontWeight: '600',
            color: '#e2e8f0',
            fontSize: '0.95rem'
          }}>
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#e2e8f0',
              fontSize: '1rem',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
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
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontWeight: '600',
            color: '#e2e8f0',
            fontSize: '0.95rem'
          }}>
            Your Feedback
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your feedback here..."
            rows={6}
            required
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#e2e8f0',
              fontSize: '1rem',
              resize: 'vertical',
              fontFamily: 'inherit',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
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
        </div>

        <button
          type="submit"
          disabled={loading || !message.trim()}
          style={{
            width: '100%',
            padding: '14px 28px',
            background: loading ? 'rgba(139, 92, 246, 0.5)' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading || !message.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !message.trim() ? 0.6 : 1,
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
            transition: 'all 0.3s ease',
            transform: loading ? 'none' : 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            if (!loading && message.trim()) {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.6)'
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && message.trim()) {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)'
            }
          }}
        >
          {loading ? '⏳ Submitting...' : '✨ Submit Feedback'}
        </button>
      </form>
    </div>
  )
}