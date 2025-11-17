import { useEffect, useState } from 'react'

function RegisterAndPay({ selectedEvent }) {
  const [step, setStep] = useState('register')
  const [reg, setReg] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [registrationId, setRegistrationId] = useState('')
  const [passCode, setPassCode] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submitRegistration = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: selectedEvent.id, ...reg })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to register')
      setRegistrationId(data.registration_id)
      setStep('pay')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const pay = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const formData = new FormData(e.target)
      const body = Object.fromEntries(formData.entries())
      body.exp_month = Number(body.exp_month)
      body.exp_year = Number(body.exp_year)
      body.registration_id = registrationId

      const res = await fetch(`${baseUrl}/api/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Payment failed')
      setPassCode(data.pass_code)
      setStep('done')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!selectedEvent) return <div className="text-gray-600">Select an event to register.</div>

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="text-lg font-semibold mb-2">{selectedEvent.title}</h3>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

      {step === 'register' && (
        <form onSubmit={submitRegistration} className="space-y-3">
          <input placeholder="Your name" value={reg.name} onChange={e=>setReg(r=>({...r, name: e.target.value}))} className="border p-2 rounded w-full" required />
          <input type="email" placeholder="Your email" value={reg.email} onChange={e=>setReg(r=>({...r, email: e.target.value}))} className="border p-2 rounded w-full" required />
          <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{loading ? 'Submitting...' : 'Continue to Payment'}</button>
        </form>
      )}

      {step === 'pay' && (
        <form onSubmit={pay} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input name="card_number" placeholder="Card number" className="border p-2 rounded" required />
            <input name="cvc" placeholder="CVC" className="border p-2 rounded" required />
            <input type="number" name="exp_month" placeholder="Exp month (MM)" className="border p-2 rounded" required />
            <input type="number" name="exp_year" placeholder="Exp year (YYYY)" className="border p-2 rounded" required />
          </div>
          <button disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">{loading ? 'Processing...' : 'Pay & Get Pass'}</button>
        </form>
      )}

      {step === 'done' && (
        <div className="space-y-2">
          <p className="text-green-700 font-semibold">Payment successful!</p>
          <p>Your attendance pass code:</p>
          <div className="font-mono text-lg bg-gray-100 p-2 rounded select-all">{passCode}</div>
          <p className="text-sm text-gray-600">Keep this code safe. You can verify it on the Verify Pass page.</p>
        </div>
      )}
    </div>
  )
}

export default RegisterAndPay
