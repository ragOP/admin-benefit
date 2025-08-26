import './App.css'
import Dashboard from './app/dashboard/page'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <Dashboard />
      <Toaster position="top-right" />
    </>
  )
}

export default App
