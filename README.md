# 3DM | Advanced 3D Booth Designer

3DM is a high-performance, web-based design suite for creating and visualizing exhibition booths. It combines a precise 2D planning interface with a real-time 3D visualization engine, allowing users to build complex layouts with physical accuracy.

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

Ensure you have **Node.js** (v18 or higher) and **npm** installed on your system.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd 3dproj
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

---

## 🏗 Project Structure

The codebase is organized into modular directories to maintain a clean separation of concerns between the 2D logic, 3D rendering, and UI state.

### Core Directories

*   **`src/routes/`**: Handles the application's file-based routing using TanStack Router.
    *   `index.tsx`: The landing page and dashboard.
    *   `editor.tsx`: The primary workspace containing the design tools.
    *   `__root.tsx`: The main layout wrapper and HTML document shell.
*   **`src/components/editor/`**: Contains the heavy-lifting logic for the design suite.
    *   `Canvas.tsx`: A Konva-powered 2D engine for precise floor plan layout and object positioning.
    *   `Preview3D.tsx`: A BabylonJS-driven real-time previewer that transforms 2D data into a full 3D environment.
    *   `Sidebar.tsx`: The asset library where users can browse and add items to the workspace.
    *   `Properties.tsx`: An inspector panel for modifying dimensions, textures, and coordinates of selected objects.
*   **`src/components/`**: Reusable interface elements like the `Header`, `Footer`, and `ThemeToggle`.
*   **`public/`**: Static assets including 3D models (GLB/STL), textures, and icons used within the editor.

---

## 🛠 Technology Stack

*   **Framework**: [TanStack Start](https://tanstack.com/start) (Full-stack React)
*   **2D Engine**: [Konva](https://konvajs.org/) (Canvas manipulation)
*   **3D Engine**: [BabylonJS](https://www.babylonjs.com/) (Real-time hardware-accelerated rendering)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Routing**: [TanStack Router](https://tanstack.com/router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 📖 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Spins up the Vite development server with HMR. |
| `npm run build` | Compiles the application for production deployment. |
| `npm run preview` | Locally previews the production build. |
| `npm run test` | Executes the test suite using Vitest. |

---

## 🛠 Deployment

To create a production-ready bundle, run:
```bash
npm run build
```
The output will be generated in the `.output` or `dist` directory (depending on the target adapter), optimized for performance and fast loading.
