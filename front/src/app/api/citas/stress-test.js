import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50, // 50 usuarios virtuales
  duration: '30s', // durante 30 segundos
};

export default function () {
  const url = 'http://localhost:3000/api/citas';
  const payload = JSON.stringify({
    nombre: 'Usuario',
    apellido: 'K6', // ✨ CAMBIO: Enviamos el apellido
    email: `usuario_k6_${__VU}@example.com`,
    celular: '123456789',
    fecha: '2025-08-04',
    hora: '10:00',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);
  check(res, { 'status is 201 or 409': (r) => r.status === 201 || r.status === 409 });
  sleep(1);
}