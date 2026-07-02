import dotenv from "dotenv";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, orderBy, query, limit } from "firebase/firestore";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(firebaseApp);

function decodeFirebaseToken(token: string): { email?: string; uid?: string } {
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const decodedJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
      const decoded = JSON.parse(decodedJson);
      return {
        email: decoded.email,
        uid: decoded.user_id || decoded.sub
      };
    }
  } catch (e) {
    console.error("[Token Decode Error]", e);
  }
  return {};
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: "Method not allowed. Use GET." });
  }

  // Verify Admin authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized: Missing Authorization header." });
  }

  const token = authHeader.substring(7);
  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ success: false, error: "Unauthorized: Invalid token format." });
  }

  const decoded = decodeFirebaseToken(token);
  const REQUIRED_ADMIN = "crazyplayz61@gmail.com";
  if (decoded.email && decoded.email.toLowerCase() !== REQUIRED_ADMIN) {
    return res.status(403).json({ success: false, error: "Forbidden: Unauthorized administrator email." });
  }

  // Optional lookup validation
  const apiKey = process.env.VITE_FIREBASE_API_KEY;
  if (apiKey) {
    try {
      const lookupResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token })
        }
      );
      const lookupData: any = await lookupResponse.json();
      if (!lookupResponse.ok || !lookupData.users || lookupData.users.length === 0) {
        return res.status(401).json({ success: false, error: "Unauthorized: Session is invalid or expired." });
      }
    } catch (err: any) {
      console.warn("[Identity Lookup Failed] Skipping but allowing jwt match:", err);
    }
  }

  try {
    const logsCol = collection(db, "download_logs");
    const q = query(logsCol, orderBy("downloadTime", "desc"));
    const querySnapshot = await getDocs(q);

    const logs: any[] = [];
    querySnapshot.forEach((docSnap) => {
      const d = docSnap.data();
      let downloadTimeFormatted = "—";
      let downloadTimeMs = 0;
      if (d.downloadTime) {
        const date = d.downloadTime.toDate ? d.downloadTime.toDate() : new Date(d.downloadTime);
        downloadTimeFormatted = date.toLocaleString();
        downloadTimeMs = date.getTime();
      }

      logs.push({
        id: docSnap.id,
        requestId: d.requestId || "—",
        email: d.email || "—",
        university: d.university || "—",
        project: d.project || "—",
        downloadTime: downloadTimeFormatted,
        downloadTimeMs,
        downloadIP: d.downloadIP || "—",
        browser: d.browser || "—",
        token: d.token ? `${d.token.substring(0, 8)}...` : "—",
        result: d.result || "—"
      });
    });

    // Compute metrics
    const totalDownloads = logs.length;
    const now = new Date();
    
    const oneDay = 24 * 60 * 60 * 1000;
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = startOfToday - (now.getDay() * oneDay);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let downloadsToday = 0;
    let downloadsThisWeek = 0;
    let downloadsThisMonth = 0;

    const projectCounts: Record<string, number> = {};
    const universityCounts: Record<string, number> = {};

    logs.forEach(log => {
      if (log.result === "success") {
        if (log.downloadTimeMs >= startOfToday) downloadsToday++;
        if (log.downloadTimeMs >= startOfWeek) downloadsThisWeek++;
        if (log.downloadTimeMs >= startOfMonth) downloadsThisMonth++;

        // Most downloaded project count
        projectCounts[log.project] = (projectCounts[log.project] || 0) + 1;
        // Most active university count
        if (log.university && log.university !== "—" && log.university !== "Unknown University") {
          universityCounts[log.university] = (universityCounts[log.university] || 0) + 1;
        }
      }
    });

    // Find most downloaded project
    let mostDownloadedProject = "—";
    let maxProjCount = 0;
    for (const [p, count] of Object.entries(projectCounts)) {
      if (count > maxProjCount) {
        maxProjCount = count;
        mostDownloadedProject = p;
      }
    }
    if (mostDownloadedProject !== "—") {
      mostDownloadedProject = `${mostDownloadedProject} (${maxProjCount} downloads)`;
    }

    // Find most active university
    let mostActiveUniversity = "—";
    let maxUnivCount = 0;
    for (const [u, count] of Object.entries(universityCounts)) {
      if (count > maxUnivCount) {
        maxUnivCount = count;
        mostActiveUniversity = u;
      }
    }
    if (mostActiveUniversity !== "—") {
      mostActiveUniversity = `${mostActiveUniversity} (${maxUnivCount} times)`;
    }

    // Newest download details
    let newestDownload = "None";
    const newestSuccess = logs.find(log => log.result === "success");
    if (newestSuccess) {
      newestDownload = `${newestSuccess.email} (${newestSuccess.project})`;
    }

    return res.status(200).json({
      success: true,
      logs,
      metrics: {
        totalDownloads,
        downloadsToday,
        downloadsThisWeek,
        downloadsThisMonth,
        mostDownloadedProject,
        mostActiveUniversity,
        newestDownload
      }
    });

  } catch (error: any) {
    console.error("[Downloads Analytics Error]", error);
    return res.status(500).json({ success: false, error: "Internal database query failure." });
  }
}
