import servicio from "./axiosServices";

export async function userReset(dataUserReset) {
  try {
    const response = await servicio.post(
      "/login/resetea-password",
      dataUserReset
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      const errorMessage =
        error.response.data?.resetea?.mensaje ||
        "Error al actualizar la contraseña.";
      throw new Error(errorMessage);
    } else {
      throw new Error("Error al actualizar la contraseña.");
    }
  }
}

export async function userProductivity(numEmpleado) {
  try {
    console.log(numEmpleado);
    const response = await servicio.get(
      `/ejecutivo/productividad-ejecutivo?numEmpleado=${numEmpleado}`
    );
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    if (error.response) {
      const errorMessage =
        error.response.data?.mensaje || "Error al recibir la productividad";
      throw new Error(errorMessage);
    } else {
      throw new Error("Error al recibir la productividad.");
    }
  }
}
