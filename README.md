# Plataforma Digital de Aprendizaje de Probabilidad

Plataforma educativa interactiva inspirada en **Brilliant**, diseñada para estudiantes de **12° grado**, con el objetivo de enseñar conceptos de **probabilidad** de forma visual, práctica y adaptada a los principios del aprendizaje activo.

La primera unidad está enfocada en **teoría de conjuntos**, sirviendo como base para introducir eventos, probabilidad clásica, condicional y otros temas.

---

## 📌 Características

- **Módulos y Lecciones**: Contenido estructurado en módulos y lecciones.
- **Ejercicios Interactivos**: Actividades dinámicas y visuales para practicar.
- **Relación N:N entre Usuarios y Módulos**: Permite asignar múltiples módulos a cada usuario y viceversa.
- **Arquitectura escalable**: Backend y frontend desacoplados.
- **Diseño pensado para ampliaciones futuras**: Posibilidad de añadir más temas y funcionalidades.

---

## 🏗 Arquitectura

El sistema está dividido en dos capas principales:

1. **Frontend**
   - Construido en **React**.
   - Se comunica con el backend mediante API REST.
   - Contiene las vistas de usuario, módulos, lecciones y ejercicios.

2. **Backend**
   - Implementado con **FastAPI**.
   - Manejo de base de datos relacional (SQLite o PostgreSQL).
   - Endpoints para CRUD de Usuarios, Módulos y Lecciones.
   - Lógica de negocio y validaciones.

