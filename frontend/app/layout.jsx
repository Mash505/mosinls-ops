export const metadata = {
  title: 'MosinLSOps | Cloud-Shell',
  description: 'AI-Native Operational Intelligence Layer for Modern DevOps',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#0a0a0a" }}>
        {children}
      </body>
    </html>
  )
}

