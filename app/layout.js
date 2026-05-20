export const metadata = {
  title: 'Led by the Lambs — Boutique Travel Planning',
  description: 'Justin & Casondra Lamb plan extraordinary trips for adventurous travelers. Based in Knoxville, Tennessee. Your dream adventure awaits.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{margin:0,padding:0}}>{children}</body>
    </html>
  )
}
