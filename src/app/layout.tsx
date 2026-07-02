import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The root layout is a passthrough — <html> and <body> are defined
  // in the child layouts ([locale]/layout.tsx and dashboard/layout.tsx)
  // so they can set lang and fonts independently.
  return children;
}
