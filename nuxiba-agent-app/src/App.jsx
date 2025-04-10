import React, { useState } from 'react'
import { Phone } from 'lucide-react'

function App() {
  const [showModal, setShowModal] = useState(false)
  const [dialNumber, setDialNumber] = useState('')

  const handleButtonClick = (value) => {
    setDialNumber((prev) => prev + value)
  }

  const handleClear = () => {
    setDialNumber('')
  }

  const dialPadButtons = [
    { main: '1', sub: '' },
    { main: '2', sub: 'ABC' },
    { main: '3', sub: 'DEF' },
    { main: '4', sub: 'GHI' },
    { main: '5', sub: 'JKL' },
    { main: '6', sub: 'MNO' },
    { main: '7', sub: 'PQRS' },
    { main: '8', sub: 'TUV' },
    { main: '9', sub: 'WXYZ' },
    { main: '*', sub: '' },
    { main: '0', sub: '+' },
    { main: '#', sub: '' },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Hola desde React + Nuxiba SDK</h1>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => setShowModal(true)}
      >
        Abrir Teléfono
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-80 relative">
            <h2 className="text-xl font-bold mb-4 text-center">Teléfono</h2>
            <input
              type="text"
              value={dialNumber}
              readOnly
              className="w-full p-2 text-center text-lg border rounded mb-4"
            />

            <div className="grid grid-cols-3 gap-4 mb-4">
              {dialPadButtons.map((btn) => (
                <button
                  key={btn.main}
                  onClick={() => handleButtonClick(btn.main)}
                  className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-black text-white"
                >
                  <span className="text-xl font-semibold">{btn.main}</span>
                  {btn.sub && (
                    <span className="text-[10px] mt-0.5 tracking-tight">{btn.sub}</span>
                  )}
                </button>
              ))}
              {/* Botón de llamada */}
              <div className="col-span-3 flex justify-center">
                <button
                  className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
                  onClick={() => alert(`Llamando a: ${dialNumber}`)}
                >
                  <Phone size={28} />
                </button>
              </div>
            </div>

            <div className="flex justify-between mt-2">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => setShowModal(false)}
              >
                Cerrar
              </button>
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={handleClear}
              >
                Borrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
