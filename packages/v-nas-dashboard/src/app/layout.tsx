import {GoogleAnalytics} from '@next/third-parties/google' //https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries#google-analytics

export const metadata = {
  title: 'Dashboard',
  description: 'NSL Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleAnalytics gaId="G-X4E5M5EGMS" />
    </html>
  )
}
