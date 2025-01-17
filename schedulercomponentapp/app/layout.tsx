export const metadata = {
  title: 'Scheduler Component App',
  description: 'A simple scheduler component app.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
