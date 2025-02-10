import React from 'react'
import Maintenence from "../../assets/img/maintenance.png"


const ejemplo = () => {
  return (
    <div style={{height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <h2 style={{color: "white"}}>Estamos dando mantenimiento </h2>
      <p style={{color: "white"}}>Vuelva mas tarde</p>
      <img src={Maintenence} alt="Mantenimiento" style={{width: "300px", borderRadius: 50, boxShadow: "blue"}}/>
    </div>
  )
}

export default ejemplo
