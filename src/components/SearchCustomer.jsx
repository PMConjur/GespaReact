import React from 'react';

const SearchCustomer = ({ data, loading, error }) => {
 
  return (
    <div>
      <h2>Buscar Usuario</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {loading ? (
        <p>Cargando...</p>
      ) : data ? (
        <div>
          <p><strong>ID Cartera:</strong> {data.idCartera}</p>
          <p><strong>ID Cuenta:</strong> {data.idCuenta}</p>//
          //Filtro:Cuenta
          <p><strong>Número Telefónico:</strong> {data.numeroTelefonico}</p>
        </div>
      ) : (
        <p>No hay datos disponibles</p>
      )}
    </div>
  );
};

export default SearchCustomer;

