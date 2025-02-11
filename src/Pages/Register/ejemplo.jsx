import React from 'react'
import Maintenence from "../../assets/img/maintenance.png"
import Maintenence2 from "../../assets/img/maintenance2.svg"


const ejemplo = () => {
  return (
    <div style={{height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      border: '2px solid orange'
    }}>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10}}>
      <img src={Maintenence2} alt="img mantenimiento"  style={{width: "50px"}}/>
      <h2 style={{color: "yellow"}}>Estamos en mantenimiento </h2>
      <img src={Maintenence2} alt="img mantenimiento" className="hover-effect" style={{width: "50px"}}/>
      </div>
       
      <h3 style={{color: "white", marginTop: 15, marginBottom: 15}}>Vuelva mas tarde</h3>
      <img src={Maintenence} alt="Mantenimiento" style={{width: "300px", borderRadius: 50, boxShadow: "blue"}}/>
    </div>
  )
}

export default ejemplo
