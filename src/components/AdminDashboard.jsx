import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import FeedbackItem from './FeedbackItem'

const CATEGORIES = ['All', 'General', 'Bug Report', 'Feature Request', 'Complaint', 'Appreciation']

export default function AdminDashboard({ session }) {
  const [feedbackList, setFeedbackList] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All') // All / Pending / Reviewed

  // Fetch all feedback
  const fetchFeedback = async () => {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setFeedbackList(data)
    setLoading(false)
  }

  useEffect(() => {
    let isMounted = true

    const loadFeedback = async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })

      if (isMounted) {
        if (!error) setFeedbackList(data)
        setLoading(false)
      }
    }

    loadFeedback()

    // Realtime subscription
    const channel = supabase
      .channel('feedback-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback' }, () => {
        if (isMounted) fetchFeedback()
      })
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const handleUpdate = (id, changes) => {
    setFeedbackList(prev => prev.map(item => item.id === id ? { ...item, ...changes } : item))
  }

  const handleDelete = (id) => {
    setFeedbackList(prev => prev.filter(item => item.id !== id))
  }

  // Apply filters
  const filtered = feedbackList.filter(item => {
    const catMatch = categoryFilter === 'All' || item.category === categoryFilter
    const statusMatch =
      statusFilter === 'All' ||
      (statusFilter === 'Reviewed' && item.is_reviewed) ||
      (statusFilter === 'Pending' && !item.is_reviewed)
    return catMatch && statusMatch
  })

  const pendingCount = feedbackList.filter(f => !f.is_reviewed).length
  const reviewedCount = feedbackList.filter(f => f.is_reviewed).length

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #312e81 50%, #1e1b4b 75%, #0f172a 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', animation: 'fadeIn 0.8s ease-out' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🛠️</div>
            <h1 style={{ fontSize: '2.2rem', margin: 0 }}>Admin Dashboard</h1>
          </div>
          <div style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div>
              <small style={{ color: 'rgba(226, 232, 240, 0.6)', display: 'block', marginBottom: '4px' }}>Logged in as</small>
              <strong style={{ color: '#e2e8f0' }}>{session.user.email}</strong>
            </div>
            <button
              onClick={handleSignOut}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                fontSize: '0.9rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {[
            { label: 'Total Feedback', value: feedbackList.length, icon: '📊', color: 'rgba(139, 92, 246, 0.2)', borderColor: 'rgba(139, 92, 246, 0.5)' },
            { label: 'Pending', value: pendingCount, icon: '⏳', color: 'rgba(245, 158, 11, 0.2)', borderColor: 'rgba(245, 158, 11, 0.5)' },
            { label: 'Reviewed', value: reviewedCount, icon: '✅', color: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.5)' },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              style={{
                background: stat.color,
                backdrop: 'blur(10px)',
                border: `2px solid ${stat.borderColor}`,
                borderRadius: '14px',
                padding: '24px',
                animation: `slideInUp 0.6s ease-out ${idx * 0.1}s both`
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{stat.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#e2e8f0', marginBottom: '8px' }}>
                {stat.value}
              </div>
              <div style={{ color: 'rgba(226, 232, 240, 0.7)', fontSize: '0.9rem', fontWeight: '500' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '14px',
          padding: '24px',
          marginBottom: '30px',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <label style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '0.95rem' }}>Filter by:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#e2e8f0',
              fontSize: '0.95rem',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.08)'
              e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)'
              e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'
            }}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#e2e8f0',
              fontSize: '0.95rem',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.08)'
              e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)'
              e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'
            }}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
          </select>
        </div>

        {/* Feedback List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{
              fontSize: '1.3rem',
              color: 'rgba(226, 232, 240, 0.7)',
              animation: 'pulse 2s infinite'
            }}>
              ⏳ Loading feedback...
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '14px',
            padding: '60px 20px',
            textAlign: 'center',
            animation: 'fadeIn 0.6s ease-out'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>📭</div>
            <p style={{ color: 'rgba(226, 232, 240, 0.6)', fontSize: '1rem' }}>No feedback found matching your filters.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.map((item, idx) => (
              <div key={item.id} style={{ animation: `slideInUp 0.5s ease-out ${idx * 0.05}s` }}>
                <FeedbackItem
                  item={item}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}