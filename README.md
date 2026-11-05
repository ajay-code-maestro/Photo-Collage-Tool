
# Photo Collage Tool

A modern web-based application for creating, customizing, and exporting beautiful photo collages. The application provides an intuitive interface with drag-and-drop functionality, customizable layouts, smart photo alignment, and AI-powered layout generation.

## Overview

Photo Collage Tool is designed to make photo collage creation simple and efficient. Users can upload multiple images, arrange them into different layouts, customize their composition, and export the final collage in high quality.

The project combines a modern React-based frontend with a Node.js backend to provide a responsive and interactive experience.

## Features

- **Multiple Image Upload:** Upload multiple photos for creating collages.
- **Drag-and-Drop Support:** Easily arrange and manage images.
- **Customizable Layouts:** Create collages using different layout arrangements.
- **AI-Powered Layout Generation:** Generate suitable collage arrangements using AI-powered functionality.
- **Smart Alignment:** Maintain proper image positioning and alignment.
- **High-Quality Export:** Export completed collages as image files.
- **Responsive Interface:** Access the application through a user-friendly interface.
- **Modern UI:** Smooth animations and interactive components.

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | Building the user interface |
| Vite | Frontend development and build tool |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling and responsive design |
| Framer Motion | Animations and transitions |
| Zustand | State management |
| React Router DOM | Client-side navigation |
| React Dropzone | File upload handling |
| Face API | Face detection capabilities |
| Lucide React | Icons and interface elements |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend server framework |
| TypeScript | Type-safe backend development |
| MySQL | Database |
| Prisma ORM | Database access and management |
| Sharp | Image processing |
| Multer | File upload handling |
| JWT | Authentication |
| Bcrypt | Password hashing |

## Project Structure

```text
Photo-Collage-Tool/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

*Note: The directory structure above is a general representation. Actual folders may vary depending on the project configuration.*

## Prerequisites

Make sure the following software is installed:

- Node.js (LTS version recommended)
- npm (Node Package Manager)
- MySQL Server
- Git

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ajay-code-maestro/Photo-Collage-Tool.git
```

### 2. Navigate to the Project Directory

```bash
cd Photo-Collage-Tool
```

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install the required dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

### 4. Backend Setup

Open a new terminal and navigate to the backend directory:

```bash
cd Photo-Collage-Tool/backend
```

Install backend dependencies:

```bash
npm install
```

Start the backend development server:

```bash
npm run dev
```

### 5. Database Configuration

The backend uses MySQL with Prisma ORM.

Configure your database connection according to your local MySQL setup and the environment variables expected by the backend.

Make sure the database is running before starting backend operations.

## Available Scripts

### Frontend Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the application for production |
| `npm run preview` | Previews the production build |
| `npm run lint` | Runs ESLint checks |

### Backend Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the backend in development mode |
| `npm run build` | Compiles TypeScript files |
| `npm start` | Starts the compiled backend application |

## Production Build

To generate an optimized frontend production build:

```bash
npm run build
```

To preview the generated production build locally:

```bash
npm run preview
```

The production-ready frontend files will be generated in the `dist` directory.

## Application Workflow

1. Open the Photo Collage Tool application.
2. Upload the required photographs.
3. Arrange the images using the available editing options.
4. Customize the collage layout.
5. Use the available alignment and layout-generation features.
6. Preview the final collage.
7. Export the completed collage.

## Future Enhancements

- Additional collage templates and layout options.
- More image editing and customization tools.
- Improved AI-based image arrangement.
- Additional export formats and quality settings.
- Cloud-based image storage.
- Enhanced mobile experience.

## Contribution

Contributions are welcome!

If you would like to contribute:

1. Fork the repository.
2. Create a new feature branch.
3. Make your changes.
4. Commit your changes.
5. Push the branch to GitHub.
6. Open a Pull Request.

## License

Refer to the license file in the repository for licensing information.

## Author

**Ajay R.**

GitHub: [@ajay-code-maestro](https://github.com/ajay-code-maestro)

---

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**Built with React, Node.js, and creativity.**
