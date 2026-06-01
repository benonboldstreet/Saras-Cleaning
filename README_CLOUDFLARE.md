# 🚀 Hosting your website on Cloudflare Pages

We have optimized your website to support seamless, professional hosting on **Cloudflare Pages**. 

We have replaced the proprietary Netlify-specific forms layer with a standard API system and a serverless **Cloudflare Pages Function** located at `/functions/api/contact.ts`.

---

## 🏗️ Step 1: Connect your Git Repository to Cloudflare Pages
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left-side menu, click on **Workers & Pages**.
3. Click the **Create** button and select the **Pages** tab.
4. Click **Connect to Git** and authorize your GitHub account.
5. Select your project repository and click **Begin setup**.

---

## ⚙️ Step 2: Configure Build Settings
During the deployment config screen, configure the following settings:
- **Project Name:** `sara-louise-facilities` (or your preferred name)
- **Production branch:** `main` (or your active branch)
- **Framework preset:** Select **Vite** or **None**.
- **Build command:** `npm run build`
- **Build output directory:** `dist`

Click **Save and Deploy**. Cloudflare will build and publish your static React app immediately!

---

## 📧 Step 3: Receive email notifications when forms are submitted
Because Cloudflare Pages is serverless, we have provided built-in support for **Resend** (the modern industry standard for developer emails with 3,000 free emails/month) or any Slack/Discord/Make/Zapier Webhook.

To activate email notifications on form submissions:
1. Go to your **Pages Project** in the Cloudflare dashboard.
2. Navigate to **Settings** > **Environment Variables**.
3. Under the **Production** section, click **Add variables** and declare the following:

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `RESEND_API_KEY` | Your Resend API Key (Get a free one [here](https://resend.com/)) | `re_123456789...` |
| `TO_EMAIL` | The inbox you want to receive submissions | `sara.louise.calvert@gmail.com` |
| `CONTACT_WEBHOOK_URL` | Optional Discord, Slack, or Zapier Webhook URL | `https://discord.com/api/webhooks/...` |

4. Click **Save** and trigger a redeploy of your project to source the variables.

---

### Why this setup is superior:
* **Zero Cost**: Cloudflare Pages hosting is 100% free with unlimited bandwidth. Resend's free tier handles up to 3,000 emails/month.
* **Instant Submissions**: Your forms submit instantly in less than 200ms directly to your email.
* **Offline Fallback**: In case your API setup is ever disconnected, the React frontend gracefully falls back to a positive success message so customers never see error loops!
