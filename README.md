# TechConnect

TechConnect is a React-based project built using Vite. It uses modern JavaScript frameworks and tools to deliver a high-performance web application. The project employs a modular structure, making it easy to maintain and extend. This README provides detailed instructions on setting up and running the project, including installing its constituent components and dependencies.

## Technologies and Tools

The project utilizes the following technologies:

- **JavaScript (React):** The core programming language used to build the application.
- **Vite:** A modern frontend build tool offering fast development and optimized builds.
- **NPM (Node Package Manager):** Used for managing the project's dependencies.
- **Yarn:** An alternative package manager to NPM, providing faster and more reliable dependency management.
- **Libraries and Frameworks:** Includes React, Firebase, Recharts, Bootstrap, Styled-Components, and others for specific functionalities.

## Installation Guide

Follow these steps to set up and run the project:

### Prerequisites

Ensure you have the following installed:
- **Node.js:** Required to run NPM and Yarn. Download it from [Node.js Official Website](https://nodejs.org/).
- **Yarn:** Installed globally using NPM.

### Step 1: Install Yarn
Yarn can be installed globally via NPM. Run the following command:
```bash
npm install -g yarn
```

To verify the installation, run:
```bash
yarn --version
```

### Step 2: Clone the Repository
Clone the TechConnect repository from GitHub:
```bash
git clone https://github.com/meekmachine/TechConnect.git
```
Navigate to the project directory:
```bash
cd TechConnect
```

### Step 3: Install Dependencies
Use Yarn to install the project's dependencies:
```bash
yarn install
```

This will download and set up all required libraries and modules as defined in the `package.json` file.

### Step 4: Run the Development Server
Start the development server using Yarn:
```bash
yarn dev
```

This will start the Vite development server, and you can access the application in your browser at `http://localhost:3000`.

### Additional Scripts

The `package.json` includes additional scripts for various tasks:
- **Build the project:** `yarn build`
- **Run the preview server:** `yarn preview`
- **Lint the codebase:** `yarn lint`
- **Deploy the app to GitHub Pages:** `yarn deploy`

### Project Structure
The project structure follows best practices for a React application:

- **`src/` directory:** Contains the main application logic, including components, pages, hooks, and utilities.
- **`public/` directory:** Contains static assets like images and icons.
- **`vite.config.js`:** Configuration for the Vite build tool.

### Contribution
Contributions are welcome! Please submit pull requests to suggest enhancements or fixes.

### License
This project is licensed under the MIT License.
