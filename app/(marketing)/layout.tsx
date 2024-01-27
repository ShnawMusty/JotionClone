import Navbar from "./_components/navbar"

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="min-h-full min-w-full flex flex-col items-center justify-center dark:bg-[#1F1F1F]">
        <Navbar/>
        <main className="flex-1 h-full w-full">
            {children}
        </main>
    </div>
  )
}

export default Layout