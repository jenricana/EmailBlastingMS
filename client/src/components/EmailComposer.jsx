import { useState, useEffect, useRef } from 'react'
import { Send, Eye, Users, CheckSquare, Square, Paperclip, X } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function EmailComposer({ clients, setClients, templates, setTemplates }) {
  const [selectedClients, setSelectedClients] = useState([])
  const [emailData, setEmailData] = useState({
    subject: '',
    body: '',
    from: ''
  })
  const [preview, setPreview] = useState(false)
  const [sending, setSending] = useState(false)
  const [results, setResults] = useState(null)
  const [attachments, setAttachments] = useState([])
  const [uploading, setUploading] = useState(false)
  const [signatureHtml, setSignatureHtml] = useState('')
  const editorRef = useRef(null)

  useEffect(() => {
    loadClients()
    loadTemplates()
    loadConfig()
    loadSignature()
  }, [])
  
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = emailData.body
    }
  }, [emailData.body])
  
  const loadSignature = async () => {
    try {
      const response = await axios.get('/api/email/signature')
      setSignatureHtml(response.data.html)
    } catch (error) {
      console.error('Failed to load signature:', error)
    }
  }

  const loadClients = async () => {
    try {
      const response = await axios.get('/api/clients')
      setClients(response.data)
    } catch (error) {
      console.error('Failed to load clients')
    }
  }

  const loadTemplates = async () => {
    try {
      const response = await axios.get('/api/templates')
      setTemplates(response.data)
    } catch (error) {
      console.error('Failed to load templates')
    }
  }

  const loadConfig = async () => {
    try {
      const response = await axios.get('/api/email/config')
      if (response.data.configured) {
        setEmailData(prev => ({ ...prev, from: response.data.from }))
      }
    } catch (error) {
      console.error('Failed to load config')
    }
  }

  const toggleClient = (client) => {
    setSelectedClients(prev =>
      prev.find(c => c.id === client.id)
        ? prev.filter(c => c.id !== client.id)
        : [...prev, client]
    )
  }

  const selectAll = () => {
    setSelectedClients(clients)
  }

  const deselectAll = () => {
    setSelectedClients([])
  }

  const loadTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setEmailData(prev => ({
        ...prev,
        subject: template.subject,
        body: template.body
      }))
      toast.success('Template loaded')
    }
  }

  const handleFileUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const formData = new FormData()
    
    for (let i = 0; i < files.length; i++) {
      formData.append('attachments', files[i])
    }

    try {
      const response = await axios.post('/api/email/upload-attachments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setAttachments([...attachments, ...response.data.files])
      toast.success(`${response.data.files.length} file(s) uploaded`)
    } catch (error) {
      toast.error('Failed to upload files: ' + (error.response?.data?.error || error.message))
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const removeAttachment = async (index) => {
    const attachment = attachments[index]
    try {
      await axios.delete('/api/email/delete-attachment', {
        data: { filePath: attachment.path }
      })
      setAttachments(attachments.filter((_, i) => i !== index))
      toast.success('Attachment removed')
    } catch (error) {
      toast.error('Failed to remove attachment')
    }
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
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await axios.post('/api/email/upload-inline-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      const imgTag = `<div style="text-align: center; margin: 20px 0;"><img src="${response.data.dataUri}" alt="${response.data.filename}" style="max-width: 600px; width: 100%; height: auto; display: block; margin: 0 auto;" /></div>`
      
      if (editorRef.current) {
        editorRef.current.innerHTML += imgTag
        setEmailData(prev => ({
          ...prev,
          body: editorRef.current.innerHTML
        }))
      } else {
        setEmailData(prev => ({
          ...prev,
          body: prev.body + imgTag
        }))
      }
      
      toast.success('Image inserted into email body')
    } catch (error) {
      toast.error('Failed to upload image: ' + (error.response?.data?.error || error.message))
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }
  
  const insertSignature = () => {
    if (signatureHtml) {
      if (editorRef.current) {
        editorRef.current.innerHTML += signatureHtml
        setEmailData(prev => ({
          ...prev,
          body: editorRef.current.innerHTML
        }))
      } else {
        setEmailData(prev => ({
          ...prev,
          body: prev.body + '\n\n' + signatureHtml
        }))
      }
      toast.success('Signature inserted')
    } else {
      toast.error('Signature not loaded')
    }
  }
  
  const handleEditorInput = (e) => {
    setEmailData(prev => ({
      ...prev,
      body: e.target.innerHTML
    }))
  }
  
  const handleEditorPaste = async (e) => {
    const items = e.clipboardData.items
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault()
        const blob = item.getAsFile()
        
        const maxSize = 200 * 1024 // 200KB in bytes
        if (blob.size > maxSize) {
          toast.error(`Pasted image must be under 200KB. Your image is ${(blob.size / 1024).toFixed(0)}KB. Please compress it before pasting.`)
          return
        }
        
        setUploading(true)
        const formData = new FormData()
        formData.append('image', blob, 'pasted-image.png')
        
        try {
          const response = await axios.post('/api/email/upload-inline-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          
          const imgTag = `<div style="margin: 10px 0;"><img src="${response.data.dataUri}" alt="Pasted image" style="max-width: 600px; width: 100%; height: auto; display: block;" /></div>`
          
          const selection = window.getSelection()
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            range.deleteContents()
            const temp = document.createElement('div')
            temp.innerHTML = imgTag
            range.insertNode(temp.firstChild)
          } else {
            editorRef.current.innerHTML += imgTag
          }
          
          setEmailData(prev => ({
            ...prev,
            body: editorRef.current.innerHTML
          }))
          
          toast.success('Image pasted')
        } catch (error) {
          toast.error('Failed to paste image: ' + (error.response?.data?.error || error.message))
        } finally {
          setUploading(false)
        }
        
        break
      }
    }
  }

  const handleSend = async () => {
    if (selectedClients.length === 0) {
      toast.error('Please select at least one client')
      return
    }

    if (!emailData.subject || !emailData.body) {
      toast.error('Please fill in subject and body')
      return
    }

    if (window.confirm(`Send email to ${selectedClients.length} client(s)?`)) {
      setSending(true)
      try {
        const response = await axios.post('/api/email/send', {
          clients: selectedClients,
          subject: emailData.subject,
          body: emailData.body,
          from: emailData.from,
          attachments: JSON.stringify(attachments)
        })
        setResults(response.data)
        
        await axios.post('/api/email/update-status', {
          results: response.data.results
        })
        
        loadClients()
        toast.success(response.data.message)
      } catch (error) {
        toast.error('Failed to send emails: ' + (error.response?.data?.error || error.message))
      } finally {
        setSending(false)
      }
    }
  }

  const handleTestEmail = async () => {
    if (!emailData.subject || !emailData.body) {
      toast.error('Please fill in subject and body')
      return
    }

    const testEmail = prompt('Enter email address for test:')
    if (testEmail) {
      try {
        await axios.post('/api/email/test', {
          to: testEmail,
          subject: emailData.subject,
          body: emailData.body,
          from: emailData.from
        })
        toast.success('Test email sent!')
      } catch (error) {
        toast.error('Failed to send test email: ' + (error.response?.data?.error || error.message))
      }
    }
  }

  const previewWithClient = selectedClients.length > 0 ? selectedClients[0] : {
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Example Corp',
    position: 'Manager',
    day: 'Monday schedule',
    arrivalTime: '08:00 AM',
    scheduleTime: new Date().toISOString()
  }

  const replaceVars = (text, client) => {
    return text
      .replace(/\{\{name\}\}/g, client.name || '')
      .replace(/\{\{email\}\}/g, client.email || '')
      .replace(/\{\{company\}\}/g, client.company || '')
      .replace(/\{\{position\}\}/g, client.position || '')
      .replace(/\{\{day\}\}/g, client.day || '')
      .replace(/\{\{arrivalTime\}\}/g, client.arrivalTime || '')
      .replace(/\{\{scheduleTime\}\}/g, client.scheduleTime || '')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Compose Email</h2>
          
          {templates.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Load Template
              </label>
              <select
                onChange={(e) => loadTemplate(e.target.value)}
                className="input-field w-full"
                defaultValue=""
              >
                <option value="">-- Select a template --</option>
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From (optional)
              </label>
              <input
                type="email"
                placeholder="Leave empty to use default"
                value={emailData.from}
                onChange={(e) => setEmailData({ ...emailData, from: e.target.value })}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                placeholder="Email subject (use {{name}}, {{company}}, etc.)"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Body * (HTML supported)
              </label>
              <div className="mb-2 flex gap-2 items-center flex-wrap">
                <button
                  type="button"
                  onClick={insertSignature}
                  className="btn-secondary text-xs"
                  disabled={!signatureHtml}
                >
                  ✍️ Insert Signature
                </button>
                <span className="text-xs text-gray-500">
                  {uploading ? 'Uploading...' : 'Add signature with logo & images'}
                </span>
              </div>
              <p className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded mb-2">
                💡 <strong>Tip:</strong> For flyers/marketing images, use "Add Attachments" section below instead of pasting. Gmail blocks inline images but displays attachments.
              </p>
              <div
                ref={editorRef}
                contentEditable={true}
                onInput={handleEditorInput}
                onPaste={handleEditorPaste}
                className="w-full min-h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  maxHeight: '500px',
                  overflowY: 'auto'
                }}
                data-placeholder="Compose your email... Use {{name}}, {{email}}, {{company}}, {{position}} for personalization. Paste images directly (Ctrl+V)!"
              />
              <p className="text-xs text-gray-500 mt-1">
                Variables: {'{{'} name {'}}'}, {'{{'} email {'}}'}, {'{{'} day {'}}'}, {'{{'} arrivalTime {'}}'}, {'{{'} company {'}}'}, {'{{'} position {'}}'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Flyers, Images, PDFs)
              </label>
              <div className="space-y-2">
                <label className="btn-secondary cursor-pointer inline-flex">
                  <Paperclip className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Add Attachments'}
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                    disabled={uploading}
                  />
                </label>
                
                {attachments.length > 0 && (
                  <div className="space-y-1">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.filename}</span>
                          <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSend}
                disabled={sending || selectedClients.length === 0}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 mr-2" />
                {sending ? 'Sending...' : `Send to ${selectedClients.length} Client(s)`}
              </button>
              <button
                onClick={handleTestEmail}
                className="btn-secondary"
              >
                Send Test
              </button>
              <button
                onClick={() => setPreview(!preview)}
                className="btn-secondary"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
            </div>
          </div>
        </div>

        {preview && (
          <div className="bg-gray-50 rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Email Preview</h3>
            <div className="bg-white rounded p-4 border">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Subject:</strong> {replaceVars(emailData.subject, previewWithClient)}
              </p>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: replaceVars(emailData.body, previewWithClient) }}
              />
              {attachments.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    📎 Attachments ({attachments.length})
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {attachments.map((file, i) => (
                      <li key={i}>• {file.filename}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Preview using: {previewWithClient.name} ({previewWithClient.email})
            </p>
          </div>
        )}

        {results && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Send Results</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-2xl font-bold text-blue-600">{results.summary.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <p className="text-2xl font-bold text-green-600">{results.summary.success}</p>
                <p className="text-sm text-gray-600">Sent</p>
              </div>
              <div className="bg-red-50 p-4 rounded">
                <p className="text-2xl font-bold text-red-600">{results.summary.failed}</p>
                <p className="text-sm text-gray-600">Failed</p>
              </div>
            </div>
            <div className="space-y-2 max-h-60 overflow-auto">
              {results.results.map((r, i) => (
                <div key={i} className={`p-2 rounded text-sm ${r.status === 'sent' ? 'bg-green-50' : 'bg-red-50'}`}>
                  <span className={r.status === 'sent' ? 'text-green-700' : 'text-red-700'}>
                    {r.status === 'sent' ? '✓' : '✗'} {r.name} ({r.email})
                  </span>
                  {r.error && <span className="text-red-600 ml-2">- {r.error}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Select Recipients
          </h3>
          <span className="text-sm text-gray-600">
            {selectedClients.length} selected
          </span>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={selectAll} className="btn-secondary text-xs flex-1">
            Select All
          </button>
          <button onClick={deselectAll} className="btn-secondary text-xs flex-1">
            Clear All
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-auto">
          {clients.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No clients available. Add clients first!
            </p>
          ) : (
            clients.map(client => (
              <div
                key={client.id}
                onClick={() => toggleClient(client)}
                className="flex items-start gap-3 p-3 rounded border hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <div className="pt-1">
                  {selectedClients.find(c => c.id === client.id) ? (
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900">{client.name}</p>
                  <p className="text-xs text-gray-600 truncate">{client.email}</p>
                  {client.day && (
                    <p className="text-xs text-gray-500">{client.day} @ {client.arrivalTime}</p>
                  )}
                  <span className={`text-xs px-1 rounded ${
                    client.status === 'Sent' ? 'bg-green-100 text-green-700' :
                    client.status === 'Failed' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {client.status || 'Pending'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
