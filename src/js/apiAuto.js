import axios from 'axios';


export const fetchData = async (token, setData, setLoading, setError) => {


 
  try {
    const response = await axios.get(
      'http://192.168.7.33/api/search-customer/automatico-ejecutivo',
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCR1JIIiwianRpIjoiMTgxNzMwMTYtYmM5ZS00NzNiLWFlNDEtZmUxZGZiNmIxOGJlIiwiVXN1YXJpbyI6IkJHUkgiLCJleHAiOjE3Mzk5MjAwOTAsImlzcyI6IjE5Mi4xNjguNy4zMyIsImF1ZCI6IjE5Mi4xNjguNS4zOCJ9.rCIy6gTIWWTB_iqaNHIrvikmWSuLPKcoT7Lzv8K8AZM`,
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


export const handleAcount = async () => {
  
  try {
    const response = await axios.get('http://192.168.7.33/api/search-customer/busqueda-cuenta', {
    
      params: { filtro: idCuenta},
      headers: {
        Authorization:  `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCR1JIIiwianRpIjoiMTgxNzMwMTYtYmM5ZS00NzNiLWFlNDEtZmUxZGZiNmIxOGJlIiwiVXN1YXJpbyI6IkJHUkgiLCJleHAiOjE3Mzk5MjAwOTAsImlzcyI6IjE5Mi4xNjguNy4zMyIsImF1ZCI6IjE5Mi4xNjguNS4zOCJ9.rCIy6gTIWWTB_iqaNHIrvikmWSuLPKcoT7Lzv8K8AZM`,
      },
    });
    console.log('Response for search term:', response.data);
    setSearchResults(response.data.listaResultados || []);
  } catch (error) {
    console.error('Error fetching search results:', error);
  }
};