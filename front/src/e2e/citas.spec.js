import { test, expect } from '@playwright/test';

test('debería permitir agendar una nueva cita y mostrarla en la lista', async ({ page }) => {
  // 1. Navegamos a la página principal
  await page.goto('http://localhost:3000/');

  // 2. Simulamos la entrada del usuario en los campos
  await page.fill('input[placeholder="Escribe tu nombre aquí"]', 'Carlos');
  // ✨ CAMBIO: Llenamos el campo de apellido
  await page.fill('input[placeholder="Escribe tu apellido aquí"]', 'Márquez');
  await page.fill('input[placeholder="ejemplo@correo.com"]', 'carlos@test.com');
  await page.fill('input[placeholder="ej. 987654321"]', '987654321');
  
  // 3. Seleccionamos una fecha y hora
  await page.selectOption('select', { value: '10:00' });

  // 4. Hacemos clic en el botón de agendar cita
  await page.click('button:has-text("Agendar Cita")');

  // 5. Verificamos que la cita se haya agregado a la lista
  await expect(page.locator('.card:has-text("Carlos Márquez")')).toBeVisible();
  await expect(page.locator('.card:has-text("carlos@test.com")')).toBeVisible();
});

test('debería mostrar un error si se intenta agendar una cita sin apellido', async ({ page }) => {
  // 1. Navegamos a la página principal
  await page.goto('http://localhost:3000/');

  // 2. Llenamos el formulario excepto el apellido
  await page.fill('input[placeholder="Escribe tu nombre aquí"]', 'Carlos');
  await page.fill('input[placeholder="ejemplo@correo.com"]', 'carlos@test.com');
  await page.fill('input[placeholder="ej. 987654321"]', '987654321');
  await page.selectOption('select', { value: '10:00' });

  // 3. Hacemos clic en el botón de agendar
  await page.click('button:has-text("Agendar Cita")');

  // 4. Verificamos que el mensaje de error aparezca en la pantalla
  await expect(page.locator('div.notification.is-danger')).toHaveText('El apellido debe tener entre 2 y 50 letras.');
});