import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login({ setIsAuth }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState({})
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    try {
      const res = await api.request('/auth/login/', { method: 'POST', body: { email, password } })
      localStorage.setItem('access', res.tokens.access)
      localStorage.setItem('refresh', res.tokens.refresh)
      setIsAuth(true)
      nav('/patients')
    } catch (err) {
      setError(err.data || err)
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 420 }}>
      <h2>Login</h2>
      <div>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button type="submit">Login</button>
      {error && Object.keys(error).length > 0 && (
  <div className="error">
    {Object.entries(error).map(([key, value]) => (
      <div
        key={key}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255,0,0,0.6)",
          color: "white",
          padding: "8px 12px",
          borderRadius: "8px",
          marginBottom: "6px"
        }}
      >
        <span>
          {Array.isArray(value)
            ? value.join(", ")
            : typeof value === "object"
            ? Object.values(value).join(", ")
            : value}
        </span>

        <button
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "18px",
            cursor: "pointer"
          }}
          onClick={() => {
            const newErr = { ...error }
            delete newErr[key]
            setError(newErr)
          }}
        >
          ×
        </button>
      </div>
    ))}
  </div>
)}



    </form>
  )
}