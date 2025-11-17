import { useState } from 'react'

function EventForm({ onCreated }) {
  const [form, setForm] = useState({
    title: '', description: '', location: '', start_time: '', end_time: '', capacity: 50, price_cents: 0, cover_image: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const body = {
        ...form,
        capacity: Number(form.capacity),
        price_cents: Math.round(Number(form.price_cents)),
        start_time: new Date(form.start_time).toISOString(),
        end_time: new Date(form.end_time).toISOString()
      }
      const res = await fetch(`${baseUrl}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed to create event')
      const data = await res.json()
      onCreated && onCreated(data)
      setForm({ title: '', description: '', location: '', start_time: '', end_time: '', capacity: 50, price_cents: 0, cover_image: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="grid sm:grid-cols-2 gap-3">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border p-2 rounded" required />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="border p-2 rounded" required />
        <input type="datetime-local" name="start_time" value={form.start_time} onChange={handleChange} className="border p-2 rounded" required />
        <input type="datetime-local" name="end_time" value={form.end_time} onChange={handleChange} className="border p-2 rounded" required />
        <input type="number" name="capacity" value={form.capacity} onChange={handleChange} placeholder="Capacity" className="border p-2 rounded" min={1} required />
        <input type="number" name="price_cents" value={form.price_cents} onChange={handleChange} placeholder="Price (cents)" className="border p-2 rounded" min={0} required />
        <input name="cover_image" value={form.cover_image} onChange={handleChange} placeholder="Cover image URL (optional)" className="border p-2 rounded sm:col-span-2" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2 rounded sm:col-span-2" rows={4} />
      </div>
      <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
        {loading ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  )
}

export default EventForm
