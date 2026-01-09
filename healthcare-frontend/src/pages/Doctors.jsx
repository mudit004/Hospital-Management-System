import React, { useEffect, useState } from "react";
import api from "../api";

const initialForm = {
  first_name: "",
  last_name: "",
  specialization: "GENERAL",
  license_number: "",
  phone: "",
  email: "",
  years_of_experience: 0,
  consultation_fee: 0,
  available: true,
};

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState({});

  async function load() {
    try {
      const res = await api.request("/doctors/");
      setDoctors(res.results || res);
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
        await api.request(`/doctors/${form.id}/`, {
          method: "PUT",
          body: form,
        });
      } else {
        await api.request("/doctors/", {
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

  async function deleteDoctor(id) {
    if (!confirm("Delete doctor?")) return;
    try {
      await api.request(`/doctors/${id}/`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e.data || e);
    }
  }

  return (
    <div>
      <h2>Doctors</h2>

      <form onSubmit={submit} style={{ maxWidth: 600 }}>
        <label>First Name</label>
        <input
          placeholder="e.g. John"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        />

        <label>Last Name</label>
        <input
          placeholder="e.g. Smith"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        />

        <label>Specialization</label>
        <select
          value={form.specialization}
          onChange={(e) => setForm({ ...form, specialization: e.target.value })}
        >
          <option value="GENERAL">General</option>
          <option value="CARDIOLOGY">Cardiology</option>
          <option value="DERMATOLOGY">Dermatology</option>
          <option value="NEUROLOGY">Neurology</option>
          <option value="PEDIATRICS">Pediatrics</option>
        </select>

        <label>License Number</label>
        <input
          placeholder="e.g. MH12345"
          value={form.license_number}
          onChange={(e) =>
            setForm({ ...form, license_number: e.target.value })
          }
        />

        <label>Phone</label>
        <input
          placeholder="e.g. 9876543210"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <label>Email</label>
        <input
          placeholder="e.g. doctor@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Years of Experience</label>
        <input
          type="number"
          placeholder="e.g. 5"
          value={form.years_of_experience}
          onChange={(e) =>
            setForm({ ...form, years_of_experience: +e.target.value })
          }
        />

        <label>Consultation Fee</label>
        <input
          type="number"
          placeholder="e.g. 500"
          value={form.consultation_fee}
          onChange={(e) =>
            setForm({ ...form, consultation_fee: +e.target.value })
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


      <h3>Doctors List</h3>

      <ul>
        {doctors.map((d) => (
          <li key={d.id}>
            Dr. {d.first_name} {d.last_name} — {d.specialization}
            <div style={{ marginTop: 8 }}>
              <button onClick={() => setForm({ ...d })}>Edit</button>
              <button onClick={() => deleteDoctor(d.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
