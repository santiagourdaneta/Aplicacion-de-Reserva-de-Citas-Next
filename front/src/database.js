import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db = null;

export async function openDb() {
  // Si la conexión ya existe, la devolvemos para reutilizarla.
  if (db) {
    return db;
  }

  // Si no existe, creamos una nueva conexión y la guardamos en la variable global.
  db = await open({
    filename: './citas.db',
    driver: sqlite3.Database,
  });

  // Creamos la tabla 'citas' si no existe.
  await db.exec(`
    CREATE TABLE IF NOT EXISTS citas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL,
      celular TEXT NOT NULL,
      fecha TEXT NOT NULL,
      apellido TEXT NOT NULL DEFAULT ''
    )
  `);

  // Verificamos si la columna 'apellido' ya existe para evitar errores
  // al ejecutar el script varias veces. Si no existe, la añadimos.
  const tableInfo = await db.all('PRAGMA table_info(citas)');
  const hasApellido = tableInfo.some(col => col.name === 'apellido');

  if (!hasApellido) {
    await db.exec('ALTER TABLE citas ADD COLUMN apellido TEXT NOT NULL DEFAULT ""');
  }

  return db;
}