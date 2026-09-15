<div align="center">

<img src="https://readme-typing-svg.herokuapp.com?font=Chakra+Petch&size=40&duration=3000&pause=1000&color=A855F7&center=true&vCenter=true&width=700&lines=NEXUS+GAMES;Video+Games+Discovery+Platform;500.000%2B+juegos+esperando+ser+descubiertos" alt="Typing SVG" />

<br/>

**🎮 Plataforma premium de descubrimiento de videojuegos**

*Explorá, buscá y descubrí tu próximo juego favorito*

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Ver_Demo_Live-A855F7?style=for-the-badge&logoColor=white)](https://juantrezza.github.io/nexus-games/)
[![RAWG API](https://img.shields.io/badge/Powered_by-RAWG.io-06B6D4?style=for-the-badge&logoColor=white)](https://rawg.io/apidocs)

<br/>

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

</div>

---

## 🎯 Sobre el Proyecto

**NEXUS GAMES** es una plataforma de descubrimiento de videojuegos inspirada en Steam, Epic Games Store e IGN. Consume la API de [RAWG.io](https://rawg.io) para ofrecer acceso a más de 500.000 juegos con búsqueda avanzada, filtros múltiples, detalles completos y sistema de wishlist personal.

Diseñado con una estética **cyberpunk gaming premium** — dark UI con acentos neón violeta y cyan, tipografía Chakra Petch para un feel futurista, y animaciones fluidas con Framer Motion.

---

## ✨ Características Principales

### 🔍 **Búsqueda y Descubrimiento**
- 🎯 Búsqueda en tiempo real con debounce (300ms)
- ⌨️ Atajo de teclado (`/`) para búsqueda rápida
- 📝 Historial de búsquedas recientes
- 🔥 Sección de juegos trending
- ⭐ Top rated y próximos lanzamientos

### 🎨 **Sistema de Filtros Avanzado**
- 🎮 Filtrado por plataforma (PC, PS5, Xbox, Switch, iOS, Android)
- 🎭 Filtrado por género (Action, RPG, Shooter, Strategy, etc.)
- 📅 Slider de año de lanzamiento (1990-2026)
- ⭐ Slider de rating Metacritic (0-95)
- 🏷️ Chips de filtros activos removibles
- 🔄 Reset de filtros con un click

### 📖 **Ficha Técnica Completa**
- 🖼️ Banner de alta resolución
- 📸 Galería de screenshots 4K con lightbox
- 📝 Descripción detallada sanitizada
- ⚙️ Especificaciones técnicas completas
- 🌐 Enlaces oficiales al sitio del juego
- 🎯 Metacritic score con código de colores
- 📊 Plataformas, desarrolladores, publishers

### ❤️ **Wishlist Personal**
- 💾 Persistencia con LocalStorage
- 📊 Contador dinámico en el header
- 🗑️ Eliminar juegos individualmente
- 🧹 Vaciar lista completa
- 📋 Exportar wishlist al portapapeles

### ⚡ **Performance y UX**
- 🎨 Skeleton loaders durante fetch
- 🔔 Toast notifications contextuales
- 💾 Cache de respuestas API (5 min TTL)
- 🔁 Reintentos automáticos de requests fallidos
- 📱 Responsive mobile-first
- 🌙 Dark mode nativo
- ♿ Accesibilidad (ARIA labels, keyboard nav)

---

## 🛠️ Stack Tecnológico

<div align="center">

| Frontend | Estilos | Animaciones | API | Deploy |
|:---:|:---:|:---:|:---:|:---:|
| React 19 | Tailwind CSS v3 | Framer Motion | RAWG.io | GitHub Pages |
| TypeScript | PostCSS | | Fetch API | GitHub Actions |
| Vite | CSS Variables | | Async/Await | |

</div>

### 🎨 Design System

```css
/* Colores principales */
--background: #0A0E1A       /* Deep space navy */
--surface: #131829          /* Surface elevated */
--primary: #A855F7          /* Electric purple */
--accent: #06B6D4           /* Neon cyan */
--success: #10B981          /* Matrix green */
--warning: #F59E0B          /* Amber */
--danger: #EF4444           /* Red */

/* Tipografía */
--font-display: 'Chakra Petch'    /* Futuristic gaming */
--font-body: 'Inter'              /* Clean UI */
--font-mono: 'JetBrains Mono'     /* Data & stats */
```

---

## 🚀 Instalación Local

### **Requisitos previos**
- Node.js 18+
- npm o yarn
- API Key de RAWG.io (gratis en [rawg.io/apidocs](https://rawg.io/apidocs))

### **Pasos**

```bash
# 1. Clonar el repositorio
git clone https://github.com/JuanTrezza/nexus-games.git

# 2. Entrar al directorio
cd nexus-games

# 3. Instalar dependencias
npm install

# 4. Crear archivo .env con tu API Key
echo "VITE_API_KEY=tu_api_key_aqui" > .env

# 5. Iniciar servidor de desarrollo
npm run dev

# 6. Abrir en el navegador
# http://localhost:5173
```

### **Build para producción**

```bash
npm run build      # Genera la carpeta dist/
npm run preview    # Preview del build local
```

---

## 📸 Screenshots

<div align="center">

### 🏠 Home con Hero dinámico
*Rotación automática de screenshots de juegos trending*

### 🔍 Búsqueda con filtros avanzados
*Sidebar de filtros + grid responsive de juegos*

### 📖 Modal de detalle completo
*Screenshots, descripción, specs y links oficiales*

### ❤️ Wishlist personal
*Drawer lateral con persistencia local*

</div>

---

## 🎯 Endpoints Utilizados

| Endpoint | Uso | Cache |
|:---|:---|:---:|
| `/games` | Lista de juegos con filtros | ✅ 5min |
| `/games/{id}` | Detalle completo | ✅ 5min |
| `/games/{id}/screenshots` | Galería de imágenes | ✅ 5min |
| `/genres` | Todos los géneros | ✅ 5min |
| `/platforms` | Todas las plataformas | ✅ 5min |

---

## 📁 Estructura del Proyecto

nexus-games/
├── src/
│ ├── components/ # Componentes UI reutilizables
│ ├── services/ # Cliente API (RAWG)
│ ├── hooks/ # Custom hooks
│ ├── types/ # Interfaces TypeScript
│ ├── utils/ # Funciones helper
│ ├── App.tsx # Componente raíz
│ ├── index.css # Tailwind directives
│ └── main.tsx # Entry point
├── public/ # Assets estáticos
├── .github/workflows/ # GitHub Actions deploy
├── tailwind.config.js # Config Tailwind v3
├── vite.config.ts # Config Vite
├── tsconfig.json # Config TypeScript
└── package.json # Dependencias


---

## 🔮 Roadmap

- [ ] 🌍 Modo multi-idioma (ES/EN/PT)
- [ ] 🎮 Comparador de juegos (2-3 side by side)
- [ ] 📊 Estadísticas del catálogo (charts)
- [ ] 🔔 Sistema de notificaciones de próximos lanzamientos
- [ ] 👤 Sistema de usuarios con Firebase Auth
- [ ] 💬 Reviews propias de usuarios
- [ ] 🎯 Sistema de recomendaciones basado en wishlist
- [ ] 📱 PWA (Progressive Web App)

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Si querés proponer mejoras:

1. Fork el proyecto
2. Creá tu feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrego nueva funcionalidad'`)
4. Push a la branch (`git push origin feature/nueva-funcionalidad`)
5. Abrí un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia [MIT](LICENSE).

**Nota:** Los datos de juegos son proporcionados por [RAWG.io API](https://rawg.io/apidocs). Todos los derechos de las imágenes y contenido pertenecen a sus respectivos dueños.

---

## 👨‍💻 Autor

<div align="center">

**Juan Moreno Trezza**

*Desarrollador Frontend Jr · Estudiante de Ciencia de Datos e IA*

Buenos Aires · Argentina 🇦🇷

<br/>

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/juanmorenotrezza/)
[![Portfolio](https://img.shields.io/badge/Portfolio-A855F7?style=for-the-badge&logo=vercel&logoColor=white)](https://juantrezza.github.io/porfolio/)
[![Behance](https://img.shields.io/badge/Behance-1769FF?style=for-the-badge&logo=behance&logoColor=white)](https://www.behance.net/juanmorenotrezza)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/JuanTrezza)
[![Gmail](https://img.shields.io/badge/Gmail-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:jgmorenotrezza@gmail.com)

</div>

---

<div align="center">

### ⭐ Si te gustó el proyecto, dale una estrella al repo ⭐

**Made with 💜 by [Juan Moreno Trezza](https://github.com/JuanTrezza)**

*Powered by [RAWG.io API](https://rawg.io/apidocs)*

</div>
