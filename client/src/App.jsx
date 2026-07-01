import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import ClientManager from './components/ClientManager'
import TemplateManager from './components/TemplateManager'
import EmailComposer from './components/EmailComposer'
import { Mail, Users, FileText } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('compose')
  const [clients, setClients] = useState([])
  const [templates, setTemplates] = useState([])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-right" />
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('compose')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'compose'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Mail className="w-5 h-5" />
              Compose & Send
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'clients'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users className="w-5 h-5" />
              Client List
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'templates'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-5 h-5" />
              Templates
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'compose' && (
              <EmailComposer 
                clients={clients} 
                setClients={setClients}
                templates={templates}
                setTemplates={setTemplates}
              />
            )}
            {activeTab === 'clients' && (
              <ClientManager clients={clients} setClients={setClients} />
            )}
            {activeTab === 'templates' && (
              <TemplateManager templates={templates} setTemplates={setTemplates} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
