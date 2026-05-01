import React, { useState, useEffect } from 'react'
import { taskAPI } from '../../services/api'

const CommentsSection = ({ taskId }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [taskId])

  const fetchComments = async () => {
    try {
      const response = await taskAPI.getComments(taskId)
      setComments(response.data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    try {
      await taskAPI.addComment(taskId, newComment)
      setNewComment('')
      fetchComments()
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>
      
      <div className="flex space-x-3 mb-6">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          placeholder="Add a comment..."
          className="input-field"
        />
        <button onClick={handleAddComment} className="btn-primary">Send</button>
      </div>

      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="border-b pb-3">
            <div className="flex justify-between mb-1">
              <span className="font-medium text-sm">{comment.user?.name || 'User'}</span>
              <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-gray-700 text-sm">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommentsSection