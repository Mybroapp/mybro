export const metadata = {
  title: 'MyBroApp',
  description: 'Tu compañero emocional',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
