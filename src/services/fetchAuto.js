import axios from 'axios';

export const fetchData = async (setData, setLoading, setError) => {
  setLoading(true);
  setError(null);
  try {
    const response = await axios.get(
      'http://192.168.7.33/api/search-customer/automatico-ejecutivo?numEmpleado=23389',
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCR1JIIiwianRpIjoiNWRiNjRmNDEtMmRjNi00OWU0LTk1YTAtZTViNzg3ZjY5NmMxIiwiVXN1YXJpbyI6IkJHUkgiLCJleHAiOjE3Mzk5MDI4ODIsImlzcyI6IjE5Mi4xNjguNy4zMyIsImF1ZCI6IjE5Mi4xNjguNS4zOCJ9.6ByhrPDP1bm1X_ySzxqxBckc8VTtEdLL-qTL5LCPA4Y`,
        },
      }
    );

    console.log('Respuesta completa:', response.data);
    setData(response.data);
  } catch (error) {
    console.error('Error en la solicitud:', error);
    setError(error.response?.data?.message || 'Error al obtener los datos');
  } finally {
    setLoading(false);
  }
};
