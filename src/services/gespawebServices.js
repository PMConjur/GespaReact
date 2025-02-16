import servicio from "./axiosServices";

export function buscarPor(loginData) {
    return servicio.get("/api/login/iniciar-sesion" + loginData); //retorna el evento dentro de la api con el nombre establecido del evento + el parametro que necesite para ejecutar el complemento
  }
  