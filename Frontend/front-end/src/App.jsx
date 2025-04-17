import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Routes, Route} from "react-router-dom"
import ViewPickups from './components/ViewPickups'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <ViewPickups></ViewPickups>
    </>
  )
}

export default App
