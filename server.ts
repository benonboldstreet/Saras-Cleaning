import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add body parsers
  app.use(express.json());

  // In-memory inquiries store
  // Pre-seed some realistic inquiries for presentation so she/the boyfriend can see how the portal works immediately!
  let inquiries: any[] = [
    {
      id: "inq_initial_1",
      name: "Marcus Sterling",
      email: "m.sterling@parkviewmanor.com",
      phone: "+44 7700 900077",
      company: "Parkview Residential Management",
      propertyType: "Communal Hallways",
      serviceType: "Deep Clean",
      message: "We have an apartment block of 4 floors near the city park in need of a full deep clean for the hallways. Carpets need hot-water extraction and all wood railings polished before the annual AGM next month. Please send over an estimate.",
      estimateDetails: {
        floors: "4 Floors",
        entryways: "2 Entryways",
        type: "Communal Hallways",
        serviceMode: "Deep Clean",
        frequency: "One-off",
        computedCost: "Custom Quote Required",
        computedHours: "5 - 7 Hours"
      },
      submittedAt: new Date(Date.now() - 48 * 3600000).toISOString(), // 2 days ago
      status: "unread"
    },
    {
      id: "inq_initial_2",
      name: "Helen Miller",
      email: "helen@millerconsulting.co.uk",
      phone: "+44 7700 904422",
      company: "Miller & Partners Co",
      propertyType: "Commercial Office",
      serviceType: "General Routine Duty Clean",
      message: "Regular weekly cleanup needed for our digital agency office space on the 2nd floor, approx 1800 sq ft. Mostly cleaning desks, kitchen counter, vacuuming carpets, and bin bag changes.",
      estimateDetails: {
        area: "Up to 2,500 sq ft",
        type: "Commercial Office",
        serviceMode: "General Routine Duty Clean",
        frequency: "Weekly",
        computedCost: "Custom Quote Required",
        computedHours: "3 - 4 Hours"
      },
      submittedAt: new Date(Date.now() - 12 * 3600000).toISOString(), // 12 hours ago
      status: "read"
    }
  ];

  // Confidential target email (stored strictly server-side)
  const TARGET_EMAIL = "Hello@SaraLouiseFacilities.com";

  // POST /api/contact submit endpoint
  app.post("/api/contact", (req, res) => {
    const { name, email, phone, company, propertyType, serviceType, message, estimateDetails } = req.body;
    
    if (!name || (!email && !phone) || !message) {
      return res.status(400).json({ error: "Missing required fields. Name and at least one contact method (email/phone) are required." });
    }

    const newInquiry = {
      id: "inq_" + Math.random().toString(36).substring(2, 11),
      name,
      email,
      phone,
      company: company || "N/A",
      propertyType: propertyType || "General Facilities Coordination",
      serviceType: serviceType || "Unspecified Service",
      message,
      estimateDetails: estimateDetails || null,
      submittedAt: new Date().toISOString(),
      status: "unread"
    };

    inquiries.unshift(newInquiry);

    // In production, we'd fire an email using nodemailer or similar.
    // For this prototype/applet, we print clearly in the server console and report success back.
    console.log("=========================================");
    console.log(`[EMAIL SEND SIMULATION] Forwarding inquiry to business owner inbox!`);
    console.log(`To: ${TARGET_EMAIL}`);
    console.log(`Subject: 📧 SARA LOUISE FACILITIES: Inquiry from ${name}`);
    console.log(`Client Information:`);
    console.log(` - Company: ${newInquiry.company}`);
    console.log(` - Email: ${newInquiry.email}`);
    console.log(` - Phone: ${newInquiry.phone}`);
    console.log(`Service Details:`);
    console.log(` - Property Type: ${newInquiry.propertyType}`);
    console.log(` - Service Requested: ${newInquiry.serviceType}`);
    if (newInquiry.estimateDetails) {
      console.log(` - Estimate Calculations:`, JSON.stringify(newInquiry.estimateDetails, null, 2));
    }
    console.log(`Message Content: "${newInquiry.message}"`);
    console.log("=========================================");

    return res.status(201).json({
      success: true,
      message: "Thank you, Sara Louise Facilities has received your inquiry! We'll reply within 24 hours.",
      simulatedEmailForward: {
        to: TARGET_EMAIL,
        subject: `New Facilities Client Message: ${name}`
      },
      data: {
        id: newInquiry.id,
        submittedAt: newInquiry.submittedAt
      }
    });
  });

  // GET /api/inquiries (secured by token)
  app.get("/api/inquiries", (req, res) => {
    const token = req.headers["authorization"];
    if (token !== "sara-access-secure") {
      return res.status(401).json({ error: "Unauthorized access token." });
    }
    return res.json({ inquiries });
  });

  // PATCH /api/inquiries/:id (update status)
  app.patch("/api/inquiries/:id", (req, res) => {
    const token = req.headers["authorization"];
    if (token !== "sara-access-secure") {
      return res.status(401).json({ error: "Unauthorized access token." });
    }
    const { id } = req.params;
    const { status } = req.body;

    const inq = inquiries.find(i => i.id === id);
    if (!inq) {
      return res.status(404).json({ error: "Inquiry not found." });
    }

    inq.status = status;
    return res.json({ success: true, inquiry: inq });
  });

  // DELETE /api/inquiries/:id (clear an inquiry if needed)
  app.delete("/api/inquiries/:id", (req, res) => {
    const token = req.headers["authorization"];
    if (token !== "sara-access-secure") {
      return res.status(401).json({ error: "Unauthorized access token." });
    }
    const { id } = req.params;
    const initialLength = inquiries.length;
    inquiries = inquiries.filter(i => i.id !== id);
    
    if (inquiries.length === initialLength) {
      return res.status(404).json({ error: "Inquiry not found." });
    }
    return res.json({ success: true, message: "Inquiry deleted successfully from cache." });
  });

  // Vite middleware or production static asset server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
