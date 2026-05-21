import { supabase } from '../supabaseClient'

export default function FeedbackItem({ item, onUpdate, onDelete }) {
  const handleToggleReviewed = async () => {
    try {
      const newReviewedStatus = !item.is_reviewed
      
      console.log('Attempting to update feedback id:', item.id, 'to reviewed status:', newReviewedStatus)
      console.log('Full item object:', item)
      
      // Try update with explicit data
      const updateData = { is_reviewed: newReviewedStatus }
      console.log('Update payload:', updateData)
      
      const { error, data } = await supabase
        .from('feedback')
        .update(updateData)
        .eq('id', item.id)
        .select()

      if (error) {
        console.error('Full Supabase error:', error)
        console.error('Error code:', error.code)
        console.error('Error message:', error.message)
        console.error('Error details:', error.details)
        
        // Show detailed error to user
        const errorMsg = error.message || error.code || 'Failed to update status'
        alert(`Update Error: ${errorMsg}\n\nPlease check browser console for details.`)
      } else {
        console.log('Successfully updated:', data)
        onUpdate(item.id, { is_reviewed: newReviewedStatus })
      }
    } catch (err) {
      console.error('Exception:', err)
      alert('An error occurred while updating.')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this feedback permanently?')) return

    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', item.id)

      if (error) {
        console.error('Error deleting feedback:', error)
        alert('Failed to delete. Please try again.')
      } else {
        onDelete(item.id)
      }
    } catch (err) {
      console.error('Exception:', err)
      alert('An error occurred while deleting.')
    }
  }

  const formattedDate = new Date(item.created_at).toLocaleString()

  return (
    <div style={{
      background: item.is_reviewed
        ? 'rgba(16, 185, 129, 0.1)'
        : 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(10px)',
      border: item.is_reviewed
        ? '1px solid rgba(16, 185, 129, 0.3)'
        : '1px solid rgba(148, 163, 184, 0.2)',
      borderRadius: '12px',
      padding: '24px',
      transition: 'all 0.3s ease',
      hover: 'transform 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = item.is_reviewed
        ? 'rgba(16, 185, 129, 0.5)'
        : 'rgba(139, 92, 246, 0.5)'
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = item.is_reviewed
        ? 'rgba(16, 185, 129, 0.3)'
        : 'rgba(148, 163, 184, 0.2)'
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = 'none'
    }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '15px'
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          {/* Category Badge */}
          <span style={{
            background: 'rgba(139, 92, 246, 0.2)',
            border: '1px solid rgba(139, 92, 246, 0.5)',
            color: '#a78bfa',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            marginRight: '8px',
            display: 'inline-block',
            marginBottom: '8px'
          }}>
            📁 {item.category}
          </span>

          {/* Status Badge */}
          <span style={{
            background: item.is_reviewed
              ? 'rgba(16, 185, 129, 0.2)'
              : 'rgba(245, 158, 11, 0.2)',
            border: item.is_reviewed
              ? '1px solid rgba(16, 185, 129, 0.5)'
              : '1px solid rgba(245, 158, 11, 0.5)',
            color: item.is_reviewed
              ? '#86efac'
              : '#fcd34d',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            display: 'inline-block'
          }}>
            {item.is_reviewed ? '✅ Reviewed' : '⏳ Pending'}
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleToggleReviewed}
            style={{
              padding: '8px 16px',
              background: item.is_reviewed
                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              transition: 'all 0.3s ease',
              boxShadow: item.is_reviewed
                ? '0 4px 15px rgba(245, 158, 11, 0.3)'
                : '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = item.is_reviewed
                ? '0 6px 20px rgba(245, 158, 11, 0.5)'
                : '0 6px 20px rgba(16, 185, 129, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = item.is_reviewed
                ? '0 4px 15px rgba(245, 158, 11, 0.3)'
                : '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}
          >
            {item.is_reviewed ? '↩️ Unmark' : '✓ Mark Reviewed'}
          </button>
          <button
            onClick={handleDelete}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
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
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Feedback Message */}
      <p style={{
        margin: '15px 0',
        fontSize: '1rem',
        lineHeight: '1.6',
        color: '#e2e8f0',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        {item.message}
      </p>

      {/* Timestamp */}
      <small style={{
        color: 'rgba(226, 232, 240, 0.5)',
        fontSize: '0.85rem',
        display: 'block'
      }}>
        📅 {formattedDate}
      </small>
    </div>
  )
}