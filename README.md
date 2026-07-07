# 🏢 Sara Louise Facilities

> **Premium Facility Maintenance & Hallway Cleaning Portal for Shared Residential Blocks & Commercial Estates in Liverpool.**

This repository contains the complete custom frontend and API infrastructure designed for **Sara Louise Facilities**, optimized for instant, serverless hosting on **Cloudflare Pages**.

---

## ✨ Features & Architecture

- **Elite Design**: An interactive, responsive, high-contrast user interface styled with luxury slate tones, designed for property developers, local estate administrators, and block owners.
- **Service Estimation & Inquiries**: Customers can customize their property sizes and common-area frequencies, and submit secure inquiries.
- **Serverless API Delivery**: Features a Cloudflare Pages Function at `/functions/api/contact.ts` to process submissions instantly without requiring a traditional backend hosting server.
- **Resend Email Integration**: Supports automatic email dispatch on form submission using the developer-friendly Resend API.
- **CORS Preflight Ready**: Standard preflight response handling is built-in to support external API integrations.

---

## 🚀 Setting up Cloudflare Pages Deployment

### 1. Link Your Git Repo
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Create** > **Pages** (tab).
3. Connect your GitHub or GitLab repository containing this code.

### 2. Configure Build & Directories
Use the following standardized parameters:
* **Framework Preset**: None (or Vite)
* **Build Command**: `npm run build`
* **Build Output Directory**: `dist`
* **Root Directory**: `/`

### 3. Setup Your Environment Variables
To receive instant email notifications whenever a client requests a quote, go to your **Pages Project** > **Settings** > **Environment Variables** (Production) and add:

| Key | Value Description |
| :--- | :--- |
| `RESEND_API_KEY` | Your Resend API secret (from [resend.com](https://resend.com)) |
| `TO_EMAIL` | The recipient address (e.g. `Hello@SaraLouiseFacilities.com`) |
| `CONTACT_WEBHOOK_URL` | *(Optional)* Discord, Slack, or Zapier endpoint for chat updates |

---

## 💻 Local Quickstart

If you need to test the platform locally on your own machine:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local Dev Server**:
   ```bash
   npm run dev
   ```

3. **Production build compilation**:
   ```bash
   npm run build
   ```
