import sendgrid from '@sendgrid/mail';
import {localBackendConfig} from "./LocalBackendConfig";
// Configure SendGrid API
sendgrid.setApiKey(localBackendConfig.SENDGRID_API_KEY as string);

export async function sendEmail(msg:{
  to: string,
  from: string,
  subject: string,
  text: string,
  html: string
}) {
  await sendgrid.send(msg);
}