import React, { useEffect, useState } from "react";
import api from "../api";

export default function Mappings() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [selPatient, setSelPatient] = useState("");
  const [selDoctor, setSelDoctor] = useState("");
  const [error, setError] = useState({});

  function normalize(res){
  if (Array.isArray(res)) return res
  if (Array.isArray(res.results)) return res.results
  if (Array.isArray(res.doctors)) return res.doctors
  return []
}

  async function load() {
    try {
      const p = await api.request("/patients/");
      const d = await api.request("/doctors/");
      const m = await api.request("/mappings/");
      setPatients(p.results || p);
      setDoctors(d.results || d);
      setMappings(normalize(m));
    } catch (e) {
      setError(e.data || e);
    }
  }

  useEffect(() => {
    load();
  }, []);
  
  async function assign(e) {
    e.preventDefault();
    try {
      await api.request("/mappings/", {
        method: "POST",
        body: { patient: selPatient, doctor: selDoctor },
      });
      setSelDoctor("");
setSelPatient("");
setMappings([]);
load();

    } catch (err) {
      setError(err.data || err);
    }
  }

async function removeMapping(id) {
  if (!confirm("Remove this doctor from patient?")) return;

  try {
    await api.request(`/mappings/${id}/`, { method: "DELETE" });

    // Always refresh from the true source of truth
    const res = selPatient
      ? await api.request(`/mappings/patient/${selPatient}/`)
      : await api.request("/mappings/");

    setMappings(normalize(res));
  } catch (e) {
    setError(e.data || e);
  }
}

  async function getPatientDoctors() {
    if (!selPatient) return;
    try {
      const res = await api.request(`/mappings/patient/${selPatient}/`);
      setMappings(normalize(res));
    } catch (e) {
      setError(e.data || e);
    }
  }

  return (
    <div>
      <h2>Doctor Assignments</h2>

      <form onSubmit={assign} style={{ maxWidth: 600 }}>
        <h3>Assign Doctor to Patient</h3>

        <label>Patient</label>
        <select value={selPatient} onChange={(e) => setSelPatient(e.target.value)}>
          <option value="">Select patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.first_name} {p.last_name}
            </option>
          ))}
        </select>

        <label>Doctor</label>
        <select value={selDoctor} onChange={(e) => setSelDoctor(e.target.value)}>
          <option value="">Select doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              Dr. {d.first_name} {d.last_name}
            </option>
          ))}
        </select>

        <button type="submit" disabled={!selPatient || !selDoctor}>
  Assign
</button>

      </form>

      <div style={{ marginTop: 24 }}>
        <h3>Get Doctors for Patient</h3>
        <select onChange={(e) => setSelPatient(e.target.value)} value={selPatient}>
          <option value="">--pick--</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.first_name} {p.last_name}
            </option>
          ))}
        </select>
        <button onClick={getPatientDoctors}>Load</button>
      </div>

      <h3 style={{ marginTop: 24 }}>Assignments</h3>
      <ul>
        {mappings.map((m) => (
          <li key={m.id}>
            {m.patient_name} → {m.doctor_name} (since {m.assigned_date})
            <button style={{ marginLeft: 12 }} onClick={() => removeMapping(m.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

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

    </div>
  );
}
