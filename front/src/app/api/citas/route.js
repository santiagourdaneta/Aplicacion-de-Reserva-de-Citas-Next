import { openDb } from '@/database';

const rateLimiter = (options) => {
  const { windowMs, max } = options;
  const requests = new Map();

  return (request) => {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }
    const userRequests = requests.get(ip).filter(timestamp => timestamp > now - windowMs);
    requests.set(ip, userRequests);

    if (userRequests.length >= max) {
      return false;
    }

    userRequests.push(now);
    return true;
  };
};

const limiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 5,
});

let citasCache = null;
let cacheExpires = 0;
const CACHE_TTL = 30000;

const getCitas = async () => {
  const now = Date.now();
  if (citasCache && now < cacheExpires) {
    return citasCache;
  }
  const db = await openDb();
  const citas = await db.all('SELECT * FROM citas');
  citasCache = citas;
  cacheExpires = now + CACHE_TTL;
  return citas;
};

const invalidateCache = () => {
  citasCache = null;
  cacheExpires = 0;
};

export async function GET() {
  const citas = await getCitas();
  return new Response(JSON.stringify(citas), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  if (!limiter(request)) {
    return new Response(
      JSON.stringify({ error: 'Demasiadas peticiones. Inténtalo de nuevo más tarde.' }),
      { status: 429 }
    );
  }
  
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'El cuerpo de la petición es inválido.' }),
      { status: 400 }
    );
  }

  const { nombre, apellido, email, celular, fecha, hora } = body;

  if (!nombre || nombre.length < 2 || nombre.length > 50) {
    return new Response(JSON.stringify({ error: 'El nombre debe tener entre 2 y 50 caracteres.' }), { status: 400 });
  }
  if (!apellido || apellido.length < 2 || apellido.length > 50) {
    return new Response(JSON.stringify({ error: 'El apellido debe tener entre 2 y 50 caracteres.' }), { status: 400 });
  }
  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'El correo electrónico no es válido.' }), { status: 400 });
  }
  if (!celular || celular.length < 7 || celular.length > 15) {
    return new Response(JSON.stringify({ error: 'El número de celular debe tener entre 7 y 15 dígitos.' }), { status: 400 });
  }
  
  // ✨ VALIDACIÓN BACKEND: Verificamos que la hora no esté vacía
  if (!hora) {
    return new Response(JSON.stringify({ error: 'Debes seleccionar una hora.' }), { status: 400 });
  }

  const fechaCompleta = new Date(`${fecha}T${hora}`);
  // ✨ VALIDACIÓN BACKEND: Verificamos que la fecha y hora sean válidas
  if (isNaN(fechaCompleta.getTime())) {
    return new Response(JSON.stringify({ error: 'La fecha o la hora proporcionadas no son válidas.' }), { status: 400 });
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (fechaCompleta < hoy) {
    return new Response(JSON.stringify({ error: 'No puedes agendar citas en el pasado.' }), { status: 400 });
  }

  const db = await openDb();

  const citaExistente = await db.get('SELECT * FROM citas WHERE fecha = ?', fechaCompleta.toISOString());
  if (citaExistente) {
    return new Response(JSON.stringify({ error: 'Este horario ya está reservado. Por favor, elige otro.' }), { status: 409 });
  }
  
  const result = await db.run('INSERT INTO citas (nombre, apellido, email, celular, fecha) VALUES (?, ?, ?, ?, ?)', nombre, apellido, email, celular, fechaCompleta.toISOString());

  invalidateCache();

  const nuevaCita = { id: result.lastID, nombre, apellido, email, celular, fecha: fechaCompleta.toISOString() };
  return new Response(JSON.stringify(nuevaCita), { status: 201 });
}

export async function PUT(request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'El cuerpo de la petición es inválido.' }), { status: 400 });
  }

  const { id, nombre, apellido, email, celular, fecha, hora } = body;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Falta el ID de la cita.' }), { status: 400 });
  }
  if (!nombre || nombre.length < 2 || nombre.length > 50) {
    return new Response(JSON.stringify({ error: 'El nombre debe tener entre 2 y 50 caracteres.' }), { status: 400 });
  }
  if (!apellido || apellido.length < 2 || apellido.length > 50) {
    return new Response(JSON.stringify({ error: 'El apellido debe tener entre 2 y 50 caracteres.' }), { status: 400 });
  }
  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'El correo electrónico no es válido.' }), { status: 400 });
  }
  if (!celular || celular.length < 7 || celular.length > 15) {
    return new Response(JSON.stringify({ error: 'El número de celular debe tener entre 7 y 15 dígitos.' }), { status: 400 });
  }
  
  // ✨ VALIDACIÓN BACKEND: Verificamos que la hora no esté vacía
  if (!hora) {
    return new Response(JSON.stringify({ error: 'Debes seleccionar una hora.' }), { status: 400 });
  }

  const fechaCompleta = new Date(`${fecha}T${hora}`);

  // ✨ VALIDACIÓN BACKEND: Verificamos que la fecha y hora sean válidas
  if (isNaN(fechaCompleta.getTime())) {
    return new Response(JSON.stringify({ error: 'La fecha o la hora proporcionadas no son válidas.' }), { status: 400 });
  }

  const db = await openDb();
  
  const citaExistente = await db.get('SELECT * FROM citas WHERE fecha = ? AND id != ?', fechaCompleta.toISOString(), id);
  if (citaExistente) {
    return new Response(JSON.stringify({ error: 'Este horario ya está reservado por otra cita.' }), { status: 409 });
  }

  const result = await db.run(
    'UPDATE citas SET nombre = ?, apellido = ?, email = ?, celular = ?, fecha = ? WHERE id = ?',
    nombre,
    apellido,
    email,
    celular,
    fechaCompleta.toISOString(),
    id
  );

  if (result.changes === 0) {
    return new Response(JSON.stringify({ error: 'Cita no encontrada o no hubo cambios.' }), { status: 404 });
  }
  invalidateCache();
  return new Response(JSON.stringify({ mensaje: 'Cita actualizada con éxito.' }), { status: 200 });
}

export async function DELETE(request) {
  const { id } = await request.json();
  const db = await openDb();
  const result = await db.run('DELETE FROM citas WHERE id = ?', id);

  if (result.changes === 0) {
    return new Response(JSON.stringify({ error: 'Cita no encontrada.' }), { status: 404 });
  }

  invalidateCache();
  return new Response(JSON.stringify({ mensaje: 'Cita eliminada con éxito.' }), { status: 200 });
}