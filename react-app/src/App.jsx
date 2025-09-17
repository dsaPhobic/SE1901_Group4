import { useEffect, useState } from 'react'

export default function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Hàm gọi API
  const fetchData = async () => {
    try {
      const res = await fetch('/api/WeatherForecast') // proxy -> https://localhost:7264/WeatherForecast
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // gọi ngay lần đầu
    fetchData()

    // set interval gọi lại mỗi 5 giây
    const interval = setInterval(fetchData, 5000)

    // cleanup interval khi component unmount
    return () => clearInterval(interval)
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  return (
    <div style={{ padding: 20 }}>
      <h1>Weather Forecast (from .NET API)</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            <b>{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</b>
            {' — '}
            {item.summary ?? 'No summary'}
            {' — '}
            {item.temperatureC}°C
          </li>
        ))}
      </ul>
    </div>
  )
}