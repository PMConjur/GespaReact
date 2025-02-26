import servicio from "./axiosServices";

const responseData =
location.state || JSON.parse(localStorage.getItem("responseData")); 
const token = responseData?.ejecutivo?.token;
const apiUrl = import.meta.env.VITE_API_URL;


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

//Endpoint Telefonos
export const fetchPhones = async (idCuenta) => {
  try {
    console.log("Iniciando llamada a la API...");
    console.log("URL de la API:", `${apiUrl}/search-customer/phones?idCuenta=${idCuenta}`);

    const response = await fetch(
      `${apiUrl}/search-customer/phones?idCuenta=${idCuenta}`,
      {
        method: "GET", // Método HTTP (GET, POST, etc.)
        headers: {
          "Authorization": `Bearer ${token}`, // Incluye el token en el header
          "Content-Type": "application/json", // Tipo de contenido
        },
      }
    );
    console.log("Respuesta de la API recibida. Estado:", response.status);

    if (!response.ok) {
      console.error("Error en la respuesta de la API. Estado:", response.status);
      throw new Error("Error al obtener los datos de teléfonos");
    }

    const data = await response.json();
    console.log("Datos obtenidos de la API:", data);

    return data;
  } catch (error) {
    console.error("Error en fetchPhones:", error);
    throw error;
  }
};

