'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export default function UnauthorizedPage() {
  const router = useRouter()
  const [counter, setCounter] = useState(5)
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
    const timer = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter <= 1) {
          clearInterval(timer)
          router.push('/')
        }
        return prevCounter - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [router])

  const goHome = () => router.push('/')

  return (
    <div className="min-h-screen bg-gradient-to-br to-red-200 flex items-center justify-center px-4">
      <div 
        className={`max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-500 ease-out transform ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12'
        }`}
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <ShieldAlert className="text-red-500 w-20 h-20 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Acceso No Autorizado</h1>
          <p className="text-center text-gray-600 mb-8">
            Lo sentimos, no tienes permiso para acceder a esta página. 
            {counter > 0 
              ? `Serás redirigido a la página de inicio en ${counter} segundo${counter !== 1 ? 's' : ''}.`
              : 'Redirigiendo a la página de inicio...'}
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={goHome}
              className="flex items-center space-x-2 transition-transform duration-200 ease-in-out hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ir al Inicio</span>
            </Button>
          </div>
        </div>
        <div className="bg-red-500 p-4">
          <p className="text-white text-center text-sm">
            Si crees que esto es un error, por favor contacta al administrador.
          </p>
        </div>
      </div>
    </div>
  )
}

