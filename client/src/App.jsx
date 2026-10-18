import React from 'react'
import { useRoutes } from 'react-router-dom'
import Navigation from './components/Navigation'
import ViewLaptops from './pages/ViewLaptops'
import CreateLaptop from './pages/CreateLaptop'
import LaptopDetails from './pages/LaptopDetails'
import './App.css'

const App = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <CreateLaptop />
    },
    {
      path: '/laptops',
      element: <ViewLaptops />
    },
    ,
    {
      path: '/edit/:id',
      element: <CreateLaptop />
    },
    {
      path: '/laptops/:id',
      element: <LaptopDetails />
    }
  ])
  

  return (
    <div className="app">
      <Navigation />
      {element}
    </div>
  )
}

export default App