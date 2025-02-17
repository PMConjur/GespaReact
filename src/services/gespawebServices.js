import servicio from "./axiosServices";

export async function userReset(dataUserReset) {
  try {
    const response = await servicio.post(
      "/login/resetea-password",
      dataUserReset
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("No autorizado. Verifique sus credenciales.");
    } else {
      throw new Error("Error al actualizar la contraseña.");
    }
  }
}
