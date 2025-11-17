import { useEffect, useState } from 'react'
import Header from './components/Header'
import EventCard from './components/EventCard'
import EventForm from './components/EventForm'
import RegisterAndPay from './components/RegisterAndPay'

function App() {
  const [view, setView] = useState('browse')
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/events`)
      const data = await res.json()
      setEvents(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { fetchEvents() }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header onNavigate={setView} current={view} />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {view === 'browse' && (
          <div className="grid md:grid-cols-3 gap-4">
            {events.length === 0 && (
              <div className="md:col-span-3 text-center text-gray-600">No events yet. Create one!</div>
            )}
            {events.map((ev) => (
              <EventCard key={ev.id} event={ev} onRegister={(e)=>{ setSelectedEvent(e); setView('register') }} />
            ))}
          </div>
        )}

        {view === 'create' && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-3">Create an Event</h2>
            <EventForm onCreated={() => { fetchEvents(); setView('browse') }} />
          </div>
        )}

        {view === 'register' && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <RegisterAndPay selectedEvent={selectedEvent} />
            </div>
            <div className="md:col-span-1">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold mb-2">Event details</h4>
                {selectedEvent ? (
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><span className="font-medium">Where:</span> {selectedEvent.location}</p>
                    <p><span className="font-medium">When:</span> {new Date(selectedEvent.start_time).toLocaleString()}</p>
                    <p><span className="font-medium">Price:</span> ${(selectedEvent.price_cents/100).toFixed(2)}</p>
                  </div>
                ) : <p className="text-gray-600">Select an event from the list.</p>}
              </div>
            </div>
          </div>
        )}

        {view === 'verify' && (
          <VerifyPass />
        )}
      </main>
    </div>
  )
}

function VerifyPass() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const verify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`${baseUrl}/api/pass/${code}`)
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ valid: false })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow max-w-lg">
      <h2 className="text-2xl font-semibold mb-3">Verify Attendance Pass</h2>
      <form onSubmit={verify} className="flex gap-2 mb-3">
        <input value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Enter pass code" className="border p-2 rounded flex-1" />
        <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{loading ? 'Checking...' : 'Verify'}</button>
      </form>
      {result && (
        result.valid ? (
          <div className="text-green-700">
            Valid pass for {result.name} ({result.email}).
          </div>
        ) : (
          <div className="text-red-600">Invalid pass code.</div>
        )
      )}
    </div>
  )
}

export default App
