# Here are your Instructions
# Chroma Key Protocol

A full-stack web application built around the **Chroma Key Protocol** — a structured, role-based system designed to manage user access, identity, and interaction flows within a branded, high-contrast UI environment.

---

## 🧠 Overview

This project is a **React + Python full-stack application** with:

* A **custom-designed frontend** (React + Tailwind)
* A **lightweight backend API** (Python)
* A developing **design system (tokens + Tailwind integration)**
* A structured product direction defined via internal PRD and UX docs

---

## ⚙️ Tech Stack

### Frontend

* React
* Tailwind CSS
* Framer Motion
* React Router

### Backend

* Python (Flask-style API)
* Custom DB client (`db_client.py`)

### Design System

* Tailwind config (extended)
* CSS variables (HSL-based)
* Token-based color system (brand layer)

---

## 📁 Project Structure

```
/frontend
  /src
    /components
    /pages
      Login.js
      SeekerPage.js
    /styles
    App.js
    index.js

/backend
  server.py
  db_client.py

/memory
  PRD.md

UX_FUNCTIONALITY_RECOMMENDATIONS.md
design_guidelines.json
```

---

## 🚀 Running the App

### 1. Start Backend

```bash
cd backend
python server.py
```

---

### 2. Start Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🔑 Core Flow (MVP)

```
Login → Authentication → Dashboard / SeekerPage
```

### Expected behavior:

* User submits credentials
* Backend validates
* Frontend redirects on success
* User-specific page loads

---

## 🎨 Design System

This project uses a **dual-layer design system**:

### 1. System Layer (HSL / shadcn-style)

Used for:

* `bg-primary`
* `bg-background`
* `text-accent`

Defined via CSS variables in:

```
src/index.css
```

---

### 2. Brand Layer (Custom tokens)

Used for:

* `bg-brand-background`
* `bg-brand-primary`
* `text-brand-textPrimary`

Defined in:

```
tailwind.config.js → extend.colors.brand
```

---

## ⚠️ Important Notes

* Tailwind config changes require a **dev server restart**
* Do not mix:

  * old `chroma-*` classes ❌
  * new `brand-*` system ✅
* `.env` should not contain sensitive production keys

---

## 🧪 Current State

This project is currently:

* ✅ Structurally sound
* ⚠️ Partially integrated (frontend ↔ backend)
* ⚠️ Design system mid-transition
* ❌ Not production-ready

---

## 🛠 Next Priorities

1. Complete auth flow (frontend ↔ backend)
2. Standardize UI components using tokens
3. Remove legacy `chroma-*` styles
4. Expand backend routes and validation
5. Add minimal testing

---

## 🧭 Purpose

This is a **personal project and system**, not a public package.

The goal is to evolve this into a **cohesive, branded application** with:

* consistent UI language
* clear architecture
* scalable structure

---

## 📌 Author Notes

This repo is actively evolving. Expect:

* structural changes
* design system updates
* refactors as patterns solidify

---

## 🔥 Philosophy

> Build working flows first.
> Then enforce structure.
> Then scale.
