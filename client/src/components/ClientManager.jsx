import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Upload, Download } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ClientManager({ clients, setClients }) {
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    position: '',
    day: '',
    scheduleTime: '',
    arrivalTime: '',
    status: 'Pending'
  })

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const response = await axios.get('/api/clients')
      setClients(response.data)
    } catch (error) {
      toast.error('Failed to load clients')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingClient) {
        await axios.put(`/api/clients/${editingClient.id}`, formData)
        toast.success('Client updated successfully')
      } else {
        await axios.post('/api/clients', formData)
        toast.success('Client added successfully')
      }
      loadClients()
      resetForm()
    } catch (error) {
      toast.error('Failed to save client')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await axios.delete(`/api/clients/${id}`)
        toast.success('Client deleted')
        loadClients()
      } catch (error) {
        toast.error('Failed to delete client')
      }
    }
  }

  const handleEdit = (client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      company: client.company,
      position: client.position,
      day: client.day || '',
      scheduleTime: client.scheduleTime || '',
      arrivalTime: client.arrivalTime || '',
      status: client.status || 'Pending'
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', company: '', position: '', day: '', scheduleTime: '', arrivalTime: '', status: 'Pending' })
    setEditingClient(null)
    setShowForm(false)
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('/api/clients/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success(response.data.message)
      loadClients()
    } catch (error) {
      toast.error('Failed to import clients')
    }
    e.target.value = ''
  }

  const exportToCSV = () => {
    const headers = ['name', 'email', 'day', 'scheduleTime', 'arrivalTime', 'status', 'company', 'position']
    const csvContent = [
      headers.join(','),
      ...clients.map(c => headers.map(h => c[h] || '').join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'appointment-clients.csv'
    a.click()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Client Management</h2>
        <div className="flex gap-2">
          <label className="btn-secondary cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
            <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
          </label>
          <button onClick={exportToCSV} className="btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingClient ? 'Edit Client' : 'Add New Client'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              required
            />
            <input
              type="text"
              placeholder="Day (e.g., Monday schedule)"
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Arrival Time (e.g., 08:00 AM)"
              value={formData.arrivalTime}
              onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
              className="input-field"
            />
            <input
              type="datetime-local"
              placeholder="Schedule Time"
              value={formData.scheduleTime}
              onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
              className="input-field"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="input-field"
            >
              <option value="Pending">Pending</option>
              <option value="Sent">Sent</option>
              <option value="Failed">Failed</option>
            </select>
            <input
              type="text"
              placeholder="Company (optional)"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Position (optional)"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="input-field"
            />
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="btn-primary">
                {editingClient ? 'Update' : 'Add'} Client
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg overflow-hidden border">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Arrival Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{client.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{client.day || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{client.arrivalTime || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    client.status === 'Sent' ? 'bg-green-100 text-green-800' :
                    client.status === 'Failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {client.status || 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(client)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No clients yet. Add your first client to get started!
          </div>
        )}
      </div>
    </div>
  )
}
