import Navbar from './components/Navbar'
import Home   from './pages/Home'

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-coral-light selection:text-coral">
      <Navbar />
      <Home />
    </div>
  )
}
