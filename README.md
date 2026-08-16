# DocFormatter Web 📄✨

Una interfaz web moderna y responsiva construida para la plataforma **DocFormatter**. Esta aplicación permite a los usuarios (principalmente estudiantes universitarios) configurar y generar automáticamente documentos académicos (`.docx`) aplicando estrictas normas de formato (como APA o UPEL) a partir de texto en Markdown.

## 🚀 Características Principales

- **Portada Dinámica:** Configura fácilmente la institución, el título del trabajo, docente, fecha y gestiona una lista dinámica de autores/integrantes.
- **Formatos Universitarios (Presets):** Aplica con un solo clic los estándares **APA** (adaptado a exigencias universitarias locales) o **UPEL**. Ajusta automáticamente márgenes, fuentes, tamaños e interlineados.
- **Personalización Total:** Si las normas cambian, el usuario puede seleccionar la opción "Personalizado" y elegir sus propios márgenes, interlineado y explorar tipografías en un selector visual.
- **Experiencia de Usuario (UX):** Construido con componentes Material Design, ofreciendo *tooltips* explicativos, diálogos de información técnica y retroalimentación en tiempo real.
- **Procesamiento en la Nube:** Conectado de forma segura al backend en FastAPI que se encarga del renderizado pesado del documento Word.

## 🛠️ Stack Tecnológico

- **Framework Core:** [React Native Web](https://necolas.github.io/react-native-web/) sobre [Expo](https://expo.dev/)
- **UI & Componentes:** [React Native Paper](https://callstack.github.io/react-native-paper/) (Material Design 3)
- **Gestión de Formularios:** [React Hook Form](https://react-hook-form.com/)
- **Lenguaje:** TypeScript

## 📦 Instalación y Uso Local

Sigue estos pasos para levantar el entorno de desarrollo en tu computadora:

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/Anonymous01J/docformatter-web.git
   cd docformatter-web
2. **Instala las dependencias:**
   ```bash
   npm install
   ```
3. **Configura las variables de entorno:** Crea un archivo .env en la raíz del proyecto para enlazar el frontend con tu API:

   ```bash
   env
   EXPO_PUBLIC_API_URL=http://localhost:8000/generate
   EXPO_PUBLIC_API_KEY=tu_clave_secreta_aqui
   ```
   
4. **Inicia el servidor de desarrollo web:**

   ```bash
   npm run web
   ```
   La aplicación se abrirá automáticamente en tu navegador en http://localhost:8081.

**🤝 Contribuciones**
¡Las contribuciones son bienvenidas! Si deseas mejorar la interfaz o añadir nuevas normativas de formato, por favor abre un Issue o envía un Pull Request.