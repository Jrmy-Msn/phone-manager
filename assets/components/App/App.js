import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Home/Home'
import Login from '../Login/Login'

import './App.scss'

function App() {
  let [routes, setRoutes] = useState('{}')

  useEffect(() => {    
    const rootElement = document.querySelector('#root')
    setRoutes(rootElement.dataset.routes)
  })
  console.log(routes)
  return (
    <Routes>
      <Route path={JSON.parse(routes).login} element={<Login />} />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
