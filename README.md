# Resolver | Enterprise Incident Management Platform

Resolver is a comprehensive, AI-powered incident management and team coordination platform designed for high-stakes enterprise environments. It streamlines the lifecycle of an incident—from detection and triage to resolution and automated postmortem reporting.

## 🚀 Deployment Links
- **Platform (Manage System):** [https://resolver-manage-system.vercel.app](https://resolver-manage-system.vercel.app)
- **Marketing Website:** [https://risolver.vercel.app](https://risolver.vercel.app)
- **Backend API:** [https://risolver.onrender.com/api](https://risolver.onrender.com/api)

---

## 🏗️ Project Architecture

The project is structured as a monorepo containing the following main applications:

### 1. **Website (`/apps/website`)**
A high-fidelity marketing landing page built with **React**, **Vite**, and **Framer Motion**. It features:
- Responsive, modern design with custom glassmorphism effects.
- Dynamic feature sections and comparison tables.
- Integrated contact form connected to the backend mail service.
- SEO optimized with meta tags and semantic HTML.

### 2. **Resolver Manage System (`/apps/resolver-manage-system`)**
The core dashboard for organizational team members. Key features include:
- **Incident Dashboard:** Real-time monitoring of active and resolved incidents via **Socket.io**.
- **AI Workspace:** A dedicated command center where members can:
    - Get **AI Summaries** of complex incident data (text, logs, or images).
    - Receive **AI Suggestions** for approaches and fixes using Groq (Llama 3.1).
    - Generate automated **Postmortem Reports** with one click.
- **Reporting System:** A structured review process for incidents, including manager approval workflows for postmortem reports.
- **Team Management:** Real-time status tracking (online/away/offline) and notification system.

### 3. **Backend (`/apps/backend`)**
A robust **Node.js/Express** server powered by **MongoDB**. Highlights:
- **AI Integration:** Seamless connection with **Groq SDK** for high-speed LLM processing.
- **Real-time Engine:** **Socket.io** implementation for instant data synchronization across clients.
- **Mail Service:** Automated email notifications for contact inquiries using **Nodemailer**.
- **Authentication:** Secure JWT-based auth with organization-level isolation.
- **Cloudinary:** Integrated for secure storage and analysis of incident-related media.

### 4. **Shared UI Package (`/packages/ui`)**
A reusable component library ensuring design consistency across the entire ecosystem.

---

## 🛠️ The Resolver Workflow

1. **Incident Creation:** An incident is reported (via API, manual entry, or image upload).
2. **Assignment:** Admins or Managers assign the incident to a team member.
3. **Investigation:** The assignee uses the **AI Workspace** to analyze the problem.
4. **Resolution:** The member applies a fix (either manual or AI-suggested) and marks the incident as resolved.
5. **Postmortem:** The system prompts the generation of a postmortem report.
6. **Review & Publication:** A manager reviews the AI-generated or manual report. Upon approval, it is published to the organization's public report page.

---

## 🛠️ Technology Stack
- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, Lucide React, Redux Toolkit.
- **Backend:** Express, MongoDB (Mongoose), Socket.io, groq-sdk, Cloudinary, Nodemailer.
- **Infrastructure:** Monorepo architecture, Vercel (Frontend), Render (Backend).

---

## 🔧 Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create `.env` files in `apps/backend`, `apps/website`, and `apps/resolver-manage-system` based on the provided configuration samples.

4. **Run Development Servers:**
   ```bash
   # In the root or individual app folders
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

*Developed with a focus on speed, reliability, and AI-driven intelligence.*
