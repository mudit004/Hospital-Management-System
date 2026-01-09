import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

export default function Register({ setIsAuth }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState({})
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    try {
      const res = await api.request('/auth/register/', { method: 'POST', body: { name, email, password, password2 } })
      localStorage.setItem("access", res.tokens.access);
      localStorage.setItem("refresh", res.tokens.refresh);
      setIsAuth(true);
      nav("/patients");

    } catch (err) {
      setError(err.data || err)
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 420 }}>
      <h2>Register</h2>
      <div><label>Name</label><input value={name} onChange={e => setName(e.target.value)} /></div>
      <div><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} /></div>
      <div><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
      <div><label>Confirm</label><input type="password" value={password2} onChange={e => setPassword2(e.target.value)} /></div>
      <button type="submit">Register</button>
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