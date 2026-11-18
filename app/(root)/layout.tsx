import Navbar from "../Components/Navbar"

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
  
      <body>
        <Navbar></Navbar>
        {children}
      </body>
    
  )
}