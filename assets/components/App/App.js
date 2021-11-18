import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Home/Home'
import Login from '../Login/Login'

import './App.scss'

function App() {
  let [routes_url, setRoutes] = useState('{}')
  let [isAuth, setAuth] = useState(false)
  let [isAdmin, setAdmin] = useState(false)

  useEffect(() => {    
    const rootElement = document.querySelector('#root')
    setRoutes(rootElement.dataset.routes)
    setAuth(rootElement.dataset.auth !== undefined)
    setAdmin(rootElement.dataset.admin !== undefined)
  })

  return (
    <Routes>
      <Route path={JSON.parse(routes_url).login} element={<Login auth={isAuth}  admin={isAdmin} routes={JSON.parse(routes_url)}/>} />
      <Route path="/" element={<Home auth={isAuth} admin={isAdmin} routes={JSON.parse(routes_url)}/>} />
    </Routes>
  )
}

export default App
