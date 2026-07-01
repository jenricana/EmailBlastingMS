import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Eye } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function TemplateManager({ templates, setTemplates }) {
  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: ''
  })

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const response = await axios.get('/api/templates')
      setTemplates(response.data)
    } catch (error) {
      toast.error('Failed to load templates')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTemplate) {
        await axios.put(`/api/templates/${editingTemplate.id}`, formData)
        toast.success('Template updated successfully')
      } else {
        await axios.post('/api/templates', formData)
        toast.success('Template saved successfully')
      }
      loadTemplates()
      resetForm()
    } catch (error) {
      toast.error('Failed to save template')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await axios.delete(`/api/templates/${id}`)
        toast.success('Template deleted')
        loadTemplates()
      } catch (error) {
        toast.error('Failed to delete template')
      }
    }
  }

  const handleEdit = (template) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      subject: template.subject,
      body: template.body
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({ name: '', subject: '', body: '' })
    setEditingTemplate(null)
    setShowForm(false)
  }

  const handleInlineImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    const maxSize = 200 * 1024 // 200KB in bytes
    if (file.size > maxSize) {
      toast.error(`Image must be under 200KB. Your image is ${(file.size / 1024).toFixed(0)}KB. Please compress it first.`)
      e.target.value = ''
      return
    }

    setUploading(true)
    const formDataUpload = new FormData()
    formDataUpload.append('image', file)

    try {
      const response = await axios.post('/api/email/upload-inline-image', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      const imgTag = `\n<div style="text-align: center; margin: 20px 0;"><img src="${response.data.dataUri}" alt="${response.data.filename}" style="max-width: 600px; width: 100%; height: auto; display: block; margin: 0 auto;" /></div>\n`
      setFormData(prev => ({
        ...prev,
        body: prev.body + imgTag
      }))
      
      toast.success('Image inserted into template')
    } catch (error) {
      toast.error('Failed to upload image: ' + (error.response?.data?.error || error.message))
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Email Templates</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </button>
      </div>

      {showForm && (
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingTemplate ? 'Edit Template' : 'Create New Template'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Template Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field w-full"
              required
            />
            <input
              type="text"
              placeholder="Email Subject (use {{name}}, {{company}}, {{position}} for personalization)"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="input-field w-full"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Body (HTML supported)
              </label>
              <div className="mb-2">
                <label className="btn-secondary cursor-pointer inline-flex text-xs">
                  📷 Insert Image/Flyer
                  <input
                    type="file"
                    onChange={handleInlineImageUpload}
                    className="hidden"
                    accept="image/*"
                    disabled={uploading}
                  />
                </label>
                <span className="text-xs text-gray-500 ml-2">
                  {uploading ? 'Uploading...' : 'Embed image directly in email'}
                </span>
              </div>
              <textarea
                placeholder="Email body... Use {{name}}, {{email}}, {{company}}, {{position}} for personalization"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="input-field w-full h-64 font-mono text-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Available variables: {'{{'} name {'}}'}, {'{{'} email {'}}'}, {'{{'} day {'}}'}, {'{{'} arrivalTime {'}}'}, {'{{'} company {'}}'}, {'{{'} position {'}}'}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                {editingTemplate ? 'Update' : 'Save'} Template
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="text-green-600 hover:text-green-800"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(template)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Subject:</strong> {template.subject}
            </p>
            <p className="text-xs text-gray-500 line-clamp-3">
              {template.body.replace(/<[^>]*>/g, '').substring(0, 150)}...
            </p>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No templates yet. Create your first template to save time!
        </div>
      )}

      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{previewTemplate.name}</h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              <div className="mb-4">
                <strong className="text-sm text-gray-600">Subject:</strong>
                <p className="text-gray-800 mt-1">{previewTemplate.subject}</p>
              </div>
              <div>
                <strong className="text-sm text-gray-600">Body:</strong>
                <div
                  className="mt-2 p-4 bg-gray-50 rounded border"
                  dangerouslySetInnerHTML={{ __html: previewTemplate.body }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
