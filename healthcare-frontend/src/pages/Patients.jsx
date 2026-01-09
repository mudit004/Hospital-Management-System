import React, { useEffect, useState } from "react";
import api from "../api";

const initialForm = {
  first_name: "",
  last_name: "",
  date_of_birth: "",
  gender: "M",
  phone: "",
  email: "",
  address: "",
  medical_history: "",
};

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState({});

  async function load() {
    try {
      const res = await api.request("/patients/");
      setPatients(res.results || res);
    } catch (e) {
      setError(e.data || e);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    try {
      if (form.id) {
        await api.request(`/patients/${form.id}/`, {
          method: "PUT",
          body: form,
        });
      } else {
        await api.request("/patients/", {
          method: "POST",
          body: form,
        });
      }

      setForm(initialForm);
      load();
    } catch (err) {
      setError(err.data || err);
    }
  }

  async function deletePatient(id) {
    if (!confirm("Delete patient?")) return;
    try {
      await api.request(`/patients/${id}/`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e.data || e);
    }
  }

  return (
    <div>
      <h2>Patients</h2>

      <form onSubmit={submit} style={{ maxWidth: 600 }}>
        <input
          placeholder="First name (e.g. John)"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        />
        <input
          placeholder="Last name (e.g. Doe)"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        />
        <input
          placeholder="DOB (YYYY-MM-DD)"
          value={form.date_of_birth}
          onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
        />
        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="O">Other</option>
        </select>
        <input
          placeholder="Phone (e.g. 9876543210)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          placeholder="Email (e.g. user@email.com)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <textarea
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <textarea
          placeholder="Medical history"
          value={form.medical_history}
          onChange={(e) =>
            setForm({ ...form, medical_history: e.target.value })
          }
        />

        <button type="submit">{form.id ? "Update" : "Create"}</button>
      </form>

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


      <h3>Patients List</h3>

      <ul>
        {patients.map((p) => (
          <li key={p.id}>
            <b>
              {p.first_name} {p.last_name}
            </b>{" "}
            — {p.email}

            <div style={{ marginTop: 8 }}>
              <button onClick={() => setForm({ ...p })}>Edit</button>
              <button onClick={() => deletePatient(p.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
