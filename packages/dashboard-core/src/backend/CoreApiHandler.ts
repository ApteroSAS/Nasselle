// /!\ should be called in this file in nextJS pages/api/core/[[...path]].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { localBackendConfig } from "./LocalBackendConfig";
import { config, admin } from './FirebaseAdminApi';
import { sendEmail } from "./Sendgrid";

export async function coreApiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the path segments from the URL
  const path = req.query.path || [];
  const pathStr = Array.isArray(path) ? path.join('/') : path;

  try {
    // Config routes
    if (pathStr === 'config/core') {
      const ret: Record<string, any> = {};
      for (const key of localBackendConfig["FRONTEND_PUBLIC_ENV"] || []) {
        ret[key] = localBackendConfig[key];
      }
      return res.status(200).json(ret);
    }

    if (pathStr === 'config/firebase') {
      return res.status(200).json(config);
    }

    // User routes
    if (pathStr === 'user/create') {
      if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
      }

      const { email, password } = req.body;

      // Create user with Firebase Auth
      const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
      });

      // Store user data in Firestore
      await admin.firestore().collection('users').doc(userRecord.uid).set({
        permissions: ["user"]
      });

      return res.status(200).json(userRecord);
    }

    if (pathStr === 'user/reset') {
      if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
      }

      const { email } = req.body;

      // Generate password reset link using Firebase Auth
      const resetLink = await admin.auth().generatePasswordResetLink(email);

      // Email message with reset link
      const msg = {
        to: email,
        from: 'admin@aptero.co',
        subject: 'Password Reset Request',
        text: `Hello, you requested a password reset. Click the link to reset your password: ${resetLink}`,
        html: `
          <p>Hello,</p>
          <p>You requested a password reset. Please click the link below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
          <p>Thanks,</p>
          <p>Your Team at Aptero</p>
        `,
      };

      // Send email
      await sendEmail(msg);

      return res.status(200).json({ message: "Password reset email sent" });
    }

    // If no route matches
    return res.status(404).json({ error: 'Route not found' });

  } catch (e) {
    console.error(e.toString());
    return res.status(500).json({ error: e.toString() });
  }
}