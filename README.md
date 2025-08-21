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

### 1. **Frontend**  
- Construido en **React**.  
- Se comunica con el backend mediante **API REST**.  
- Contiene las vistas de usuario, módulos, lecciones y ejercicios.  

### 2. **Backend**  
- Implementado con **FastAPI**.  
- Manejo de base de datos relacional (**SQLite** o **PostgreSQL**).  
- Endpoints para **CRUD** de Usuarios, Módulos y Lecciones.  
- Lógica de negocio y validaciones.  

---

## ⚙️ Instalación y Ejecución  

### 🔽 Clonar el repositorio  
```bash
git clone https://github.com/usuario/probabilidad-platform.git
cd probabilidad-platform
```
📌 Backend (FastAPI)
Entrar a la carpeta del backend:

```bash
cd backend
```
Crear y activar un entorno virtual:

```bash
python -m venv venv
source venv/bin/activate   # En Linux/Mac
venv\Scripts\activate      # En Windows
```
Instalar dependencias:

```bash
pip install -r requirements.txt
```
Ejecutar el servidor:

```bash
uvicorn main:app --reload
El backend estará disponible en: http://127.0.0.1:8000
```

🎨 Frontend (React)
Entrar a la carpeta del frontend:

```bash
cd frontend
```
Instalar dependencias:

```bash
npm install
```
Ejecutar la aplicación en modo desarrollo:

```bash
npm run dev
```
El frontend estará disponible en: http://localhost:5173 (o el puerto configurado en Vite).

🧪 Tecnologías Principales
Frontend: React, Vite, TailwindCSS

Backend: FastAPI, SQLAlchemy, Pydantic

Base de datos: SQLite 


