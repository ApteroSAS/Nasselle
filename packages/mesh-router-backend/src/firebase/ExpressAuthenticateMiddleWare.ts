// Authentication middleware
import admin from "firebase-admin";

export interface AuthUserRequestInt {
  user: admin.auth.DecodedIdToken;
}

export type AuthUserRequest = Partial<AuthUserRequestInt> | any;

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Attach user info to request object
    next();
  } catch (error) {
    console.error("Error verifying ID token:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};