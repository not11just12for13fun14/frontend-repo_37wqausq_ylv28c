function EventCard({ event, onRegister }) {
  const price = (event.price_cents || 0) / 100
  const start = new Date(event.start_time)
  const end = new Date(event.end_time)

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm flex flex-col">
      {event.cover_image && (
        <img src={event.cover_image} alt={event.title} className="h-40 w-full object-cover rounded" />
      )}
      <h3 className="text-xl font-semibold mt-2">{event.title}</h3>
      <p className="text-gray-600 text-sm">{event.location}</p>
      <p className="text-gray-500 text-sm">{start.toLocaleString()} - {end.toLocaleTimeString()}</p>
      <p className="mt-2 text-gray-700 line-clamp-3">{event.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-semibold">${price.toFixed(2)}</span>
        <button onClick={() => onRegister(event)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded">
          Register
        </button>
      </div>
    </div>
  )
}

export default EventCard
