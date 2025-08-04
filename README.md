# 💖 Aplicación de Reserva de Citas

## 🌟 Descripción del Proyecto

**Aplicación de reserva de citas** moderna, diseñada para gestionar y agendar citas de manera sencilla y eficiente. Desarrollada con **Next.js**, la aplicación ofrece una interfaz intuitiva para que los usuarios puedan agendar citas, visualizar un calendario de disponibilidad y consultar el historial de citas agendadas.

La aplicación incluye un robusto sistema de validacion, garantizando que todos los datos ingresados sean correctos. Se conecta a una API para la persistencia de datos, ofreciendo una experiencia completa de punta a punta.

## 🚀 Características Principales

- **Formulario de Agendamiento de Citas:** Interfaz intuitiva para que los usuarios ingresen su información personal, seleccionen una fecha y hora.
- **Validación de Datos:** Validación en tiempo real para asegurar que el nombre, apellido, email y número de celular cumplan con los formatos requeridos.
- **Visualización de Citas:** Muestra las citas agendadas en una tabla clara y organizada.
- **Diseño Responsivo:** Funciona perfectamente en dispositivos móviles y de escritorio.

## 🛠️ Tecnologías Utilizadas

- **Frontend:**
  - `Next.js` (para la interfaz de usuario)
  - `JavaScript` (lógica y manipulación de datos)
  - `HTML5` y `CSS3` (estructura y estilos)

- **Librerías de Utilidad:**
  - `react-calendar` (para la selección de fechas)
  - `App Router` (para la navegación)
 
💾 La Persistencia de los Datos y la API
Para gestionar las citas, diseñé una API RESTful. Utilizando métodos HTTP estándar (GET, POST, etc.), creé un canal seguro y eficiente para que el frontend se comunique con la base de datos. Cada vez que un usuario agenda una cita, el frontend envía un POST con todos los datos validados a nuestra API, que se encarga de almacenar la información en una base de datos SQLite.

Opté por SQLite por su simplicidad y portabilidad. Al funcionar como un archivo, me permitió enfocarme en la lógica del negocio sin la sobrecarga de una configuración compleja de servidor. Para garantizar la seguridad, me aseguré de que cada interacción con la base de datos se realizara a través de consultas parametrizadas y así proteger al sistema contra la inyección SQL.

✅ Pruebas Implementadas

🔄 E2E y de Estrés

Pruebas End-to-End (E2E): Estas pruebas simulan el flujo completo de un usuario real, desde el navegador hasta la base de datos y viceversa. Una prueba E2E utiliza una API y una base de datos real. Utilicé Playwright para este tipo de pruebas. 

Pruebas de Estrés: Estas pruebas no se centran en la funcionalidad, sino en el rendimiento de la aplicación bajo una carga extrema. El objetivo es ver cómo se comporta el sistema cuando muchos usuarios lo usan simultáneamente. Utilicé k6 para simular muchas solicitudes al API para medir su latencia y estabilidad. Esto está relacionado con la capacidad del servidor para manejar el tráfico.

## 💻 Instalación y Uso

Sigue estos pasos para tener el proyecto corriendo en tu máquina local.

1.  Clona este repositorio:
    ```bash
    git clone https://github.com/santiagourdaneta/Aplicacion-de-Reserva-de-Citas-Next/
    ```

2.  Navega a la carpeta del proyecto:
    ```bash
    cd Aplicacion-de-Reserva-de-Citas-Next
    ```

3.  Instala las dependencias:
    ```bash
    npm install
    ```

4.  Ejecuta la aplicación en modo de desarrollo:
    ```bash
    npm start
    ```

La aplicación estará disponible en `http://localhost:3000`.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si encuentras un error o tienes una sugerencia, por favor abre un `issue` o crea un `pull request`.

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

react next.js frontend aplicacion-de-citas reservas calendario forms javascript web-app proyecto #React #Next.js #WebDev #GitHub #OpenSource #CitasOnline #BookingApp #JavaScript #Proyecto
