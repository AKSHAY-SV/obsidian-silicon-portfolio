import crypto from "crypto";
import dotenv from "dotenv";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, addDoc, Timestamp } from "firebase/firestore";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(firebaseApp);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: "Method not allowed. Use POST." });
  }

  const { token, projectId } = req.body;
  if (!token || typeof token !== "string" || !projectId || typeof projectId !== "string") {
    return res.status(400).json({ success: false, error: "Missing token or projectId." });
  }

  try {
    // 1. Verify portal token
    const reqRef = collection(db, "portfolio_access_requests");
    const q = query(reqRef, where("portalToken", "==", token), where("status", "==", "approved"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(403).json({ success: false, error: "Unauthorized: Invalid or revoked portal token." });
    }

    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();
    const requestId = docSnap.id;
    const allowedProjects: string[] = data.allowedProjects || [];

    // 2. Validate project authorization
    if (!allowedProjects.includes(projectId)) {
      return res.status(403).json({ success: false, error: "Forbidden: You are not authorized to download this resource." });
    }

    // 3. Generate secure download token
    const downloadToken = crypto.randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // 4. Store download token in Firestore
    const tokenCol = collection(db, "download_tokens");
    await addDoc(tokenCol, {
      token: downloadToken,
      requestId,
      projectId,
      expiresAt: Timestamp.fromDate(expiresAt),
      downloadCount: 0,
      used: false,
      maxDownloads: 5
    });

    return res.status(200).json({
      success: true,
      downloadUrl: `/api/downloads/serve?downloadToken=${downloadToken}`
    });
  } catch (error: any) {
    console.error("[Request Download Error]", error);
    return res.status(500).json({ success: false, error: "Internal error processing download authorization." });
  }
}
