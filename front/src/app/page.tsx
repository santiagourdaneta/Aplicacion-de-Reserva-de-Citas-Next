'use client';

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Header from '@/components/Header';
import { FaCalendarCheck, FaRegCalendarMinus, FaTrash, FaEdit, FaSave, FaSpinner } from 'react-icons/fa';

export default function Home() {
  const [fecha, setFecha] = useState(new Date());
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [hora, setHora] = useState('');
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const horariosDisponibles = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00',
    '17:00'
  ];

  const fetchCitas = async () => {
    setCargando(true);
    try {
      const res = await fetch('/api/citas');
      const data = await res.json();
      setCitas(data);
    } catch (error) {
      console.error('Error al obtener citas:', error);
      mostrarMensaje('Error al cargar las citas.', 'danger');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => {
      setMensaje({ tipo: '', texto: '' });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });
    setGuardando(true);

    if (!nombre || nombre.length < 2 || nombre.length > 50) {
      mostrarMensaje('El nombre debe tener entre 2 y 50 letras.', 'danger');
      setGuardando(false);
      return;
    }
    if (!apellido || apellido.length < 2 || apellido.length > 50) {
      mostrarMensaje('El apellido debe tener entre 2 y 50 letras.', 'danger');
      setGuardando(false);
      return;
    }
    if (!email || !email.includes('@')) {
      mostrarMensaje('El correo electrónico no es válido.', 'danger');
      setGuardando(false);
      return;
    }
    if (!celular || celular.length < 7 || celular.length > 15) {
      mostrarMensaje('El número de celular debe tener entre 7 y 15 dígitos.', 'danger');
      setGuardando(false);
      return;
    }
    // ✨ VALIDACIÓN FRONTEND: Verificamos que la hora no esté vacía
    if (!hora) {
      mostrarMensaje('Debes seleccionar un horario.', 'danger');
      setGuardando(false);
      return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fecha < hoy) {
      mostrarMensaje('¡No puedes agendar citas en un día que ya pasó!', 'danger');
      setGuardando(false);
      return;
    }

    const metodo = editandoId ? 'PUT' : 'POST';
    const bodyData = editandoId ? { id: editandoId, nombre, apellido, email, celular, fecha: fecha.toISOString().substring(0, 10), hora } : { nombre, apellido, email, celular, fecha: fecha.toISOString().substring(0, 10), hora };

    try {
      const res = await fetch('/api/citas', {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const result = await res.json();

      if (res.ok) {
        mostrarMensaje(`¡Cita ${editandoId ? 'actualizada' : 'agendada'} con éxito! 🎉`, 'success');
        setNombre('');
        setApellido('');
        setEmail('');
        setCelular('');
        setHora('');
        setEditandoId(null);
        fetchCitas();
      } else {
        mostrarMensaje(`Error: ${result.error}`, 'danger');
      }
    } catch (error) {
      console.error('Error al procesar la cita:', error);
      mostrarMensaje('Error al conectar con el servidor.', 'danger');
    } finally {
      setGuardando(false);
    }
  };

  const handleDelete = async (id) => {
    setGuardando(true);
    try {
      const res = await fetch('/api/citas', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        mostrarMensaje('Cita eliminada con éxito.', 'success');
        fetchCitas();
      } else {
        const result = await res.json();
        mostrarMensaje(`Error: ${result.error}`, 'danger');
      }
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      mostrarMensaje('Error al conectar con el servidor.', 'danger');
    } finally {
      setGuardando(false);
    }
  };

  const handleEdit = (cita) => {
    const fechaCita = new Date(cita.fecha);
    setNombre(cita.nombre);
    setApellido(cita.apellido);
    setEmail(cita.email);
    setCelular(cita.celular);
    setFecha(fechaCita);
    setHora(fechaCita.toISOString().substring(11, 16));
    setEditandoId(cita.id);
  };

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  return (
    <div>
      <Header />
      <section className="section">
        <div className="container">
          <h1 className="title">Agendar una Cita</h1>
          
          <div className="columns">
            <div className="column is-one-third">
              <div className="box">
                <h2 className="title is-5">Selecciona una fecha</h2>
                <Calendar 
                  onChange={setFecha} 
                  value={fecha} 
                  minDate={hoy} 
                />
              </div>
              <div className="box mt-4">
                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label className="label">Nombre</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        placeholder="Escribe tu nombre aquí"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        maxLength="50"
                        minLength="2"
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Apellido</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        placeholder="Escribe tu apellido aquí"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        maxLength="50"
                        minLength="2"
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Correo electrónico</label>
                    <div className="control">
                      <input
                        className="input"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Número de celular</label>
                    <div className="control">
                      <input
                        className="input"
                        type="tel"
                        placeholder="ej. 987654321"
                        value={celular}
                        onChange={(e) => setCelular(e.target.value)}
                        minLength="7"
                        maxLength="15"
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Fecha de la cita</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        value={fecha.toLocaleDateString()}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="field">
  <label className="label" htmlFor="hora">
    Hora de la cita
  </label>
  <div className="control">
    <div className="select is-fullwidth">
      <select id="hora" value={hora} onChange={(e) => setHora(e.target.value)}>
        <option value="" disabled>
          Selecciona una hora
        </option>
        {horariosDisponibles.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>
                  {mensaje.texto && <div className={`notification is-${mensaje.tipo}`}>{mensaje.texto}</div>}
                  <div className="control">
                    <button type="submit" className={`button is-fullwidth ${editandoId ? 'is-warning' : 'is-info'} ${guardando ? 'is-loading' : ''}`} disabled={guardando}>
                      {guardando ? (
                        <><FaSpinner className="icon is-small" /> Cargando</>
                      ) : editandoId ? (
                        <><FaSave style={{ marginRight: '8px' }} /> Guardar cambios</>
                      ) : (
                        <><FaCalendarCheck style={{ marginRight: '8px' }} /> Agendar Cita</>
                      )}
                    </button>
                    {editandoId && (
                      <button type="button" className="button is-light is-fullwidth mt-2" onClick={() => { setEditandoId(null); setNombre(''); setApellido(''); setEmail(''); setCelular(''); setHora(''); }}>
                        Cancelar edición
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div className="column">
              <h2 className="title is-4">Citas Agendadas</h2>
              {cargando ? (
                <div className="notification is-info is-light has-text-centered">
                  <FaSpinner className="icon is-small is-loading mr-2" /> Cargando citas...
                </div>
              ) : citas.length > 0 ? (
                citas.map((cita) => (
                  <div key={cita.id} className="card mb-3">
                    <div className="card-content">
                      <p className="title is-6">{cita.nombre} {cita.apellido}</p>
                      <p className="subtitle is-7">{cita.email}</p>
                      <p className="subtitle is-7">{cita.celular}</p>
                      <p className="subtitle is-7">
                        {new Date(cita.fecha).toLocaleString()}
                      </p>
                      <div className="is-pulled-right">
                        <button 
                          className="button is-small is-warning mr-2"
                          onClick={() => handleEdit(cita)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="button is-small is-danger"
                          onClick={() => handleDelete(cita.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="notification is-warning">
                  <FaRegCalendarMinus style={{ marginRight: '8px' }} /> No hay citas agendadas aún.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}