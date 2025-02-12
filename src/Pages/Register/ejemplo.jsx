import React from 'react'
import Maintenance from '../../assets/img/maintenance.png'

const ejemplo = () => {
  return (
    <div style={{height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "orange"}}>
      <h3>En mantenimiento</h3>
      <img src={Maintenance} alt="" style={{width: "300PX"}}/>
    </div>
  )
}

export default ejemplo
