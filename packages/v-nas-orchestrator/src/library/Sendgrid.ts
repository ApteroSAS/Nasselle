import sendgrid from '@sendgrid/mail';
import {config} from "../EnvConfig.js";


function getConfig(key: string) {
  return config[key];
}

// Configure SendGrid API
sendgrid.setApiKey(getConfig("SENDGRID_API_KEY"));

export async function sendEmail(msg:{
  to: string,
  from?: string,
  subject: string,
  text: string,
  html?: string
}) {
  if(!msg.from) {
    msg.from = getConfig("SENDMAIL_FROM_EMAIL");
  }
  if(!msg.html) {
    msg.html = msg.text;
  }
  await sendgrid.send(msg as any);
}