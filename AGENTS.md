# DocFormatter Web App - Rules & Architecture

## Context
This project is the frontend for the DocFormatter API. It is a responsive web application built using **React Native for Web**, **Expo SDK 54**, and **React Native Paper** (Material Design 3). The primary target is desktop and mobile web browsers, not native mobile apps.

## Architecture Guidelines
- **No Database**: This application is strictly a client for a REST API. Do not use local databases like SQLite, WatermelonDB, or Prisma.
- **Responsive Layout**: Do not use mobile-first navigation like Bottom Tabs. Use a responsive ""Split View"" layout for desktop screens (>800px) and a stacked layout for mobile screens.
- **Navigation**: Use Expo Router with a persistent top Appbar.

## Styling & Theming
- Use **React Native Paper** for all UI components to maintain Material Design 3 consistency.
- **Avoid TailwindCSS/NativeWind**: Stick to React Native Paper's built-in styling and standard "StyleSheet.create".
- **Dark Mode**: The theme must follow the system preference by default, but a manual toggle must be provided in the UI.

## Forms & State
- Use **React Hook Form** for managing the complex state of the ""Portada"" (Cover Page) and Document editors.
- Support dynamic lists (e.g., adding/removing team members).

## File Handling & API
- **API URL**: https://docformatter-api.onrender.com/generate (configurable).
- **Authentication**: All API requests must include the "X-API-Key" header.
- **File Upload**: Use "expo-document-picker" to allow users to upload pre-existing ".md" files into the editor.
- **File Download**: Handle ".docx" blobs returned by the API using native Web APIs ("URL.createObjectURL") for web, or "expo-file-system" and "expo-sharing" if compiled for native.

## Code Quality
- Write functional components with hooks.
- Provide descriptive placeholders and help tooltips for all form inputs.
