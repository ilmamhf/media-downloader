import { Header } from "./components/Header"
import { Hero } from "./components/Hero"
import { Features } from "./components/Features"
import { Footer } from "./components/Footer"

function App() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />

      <main className="flex-1 flex flex-col items-center">
        <Hero />
        <Features />
      </main>

      <Footer />
    </div>
  )
}

export default App
