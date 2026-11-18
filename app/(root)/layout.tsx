import Navbar from "../Components/Navbar"

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
  
      <>
        <Navbar></Navbar>
        {children}
      </>
    
  )
}