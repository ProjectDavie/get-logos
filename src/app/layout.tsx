export const metadata = {
  title: "Game Timer App",
  description: "Football game timer with editable start",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
