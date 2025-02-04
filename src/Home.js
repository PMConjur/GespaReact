import React, { useEffect, useState } from "react";

export default function Home() {
  const projectName = "Gespa Web";
  const motivationalPhrases = [
    "- El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    "- Cree en ti mismo y todo será posible.",
  ];

  const teamMembers = [
    { name: "Marilin", role: "Project Owner", User: "HGMA" },
    { name: "Uriel", role: "PM", User: "BGRH" },
    { name: "Kike", role: "Dev Back", User: "EBMR" },
    { name: "Cesar", role: "Dev Back", User: "ROAC" },
    { name: "Yoshi", role: "Dev Back", User: "YORC" },
    { name: "Omar", role: "Dev Front", User: "VLYI" },
    { name: "Alejandro", role: "Dev Front", User: "MSVJ" },
    { name: "Fer", role: "Dev Analista", User: "LUJM" },
  ];

  const [selectedUser, setSelectedUser] = useState(teamMembers[0].User);
  const [showRole, setShowRole] = useState(teamMembers.map(() => false));
  const [data, setData] = useState(null);

  const toggleRole = (index) => {
    setShowRole((prev) =>
      prev.map((value, i) => (i === index ? !value : value))
    );
    setSelectedUser(teamMembers[index].User);
  };

  useEffect(() => {
    fetch(
      `http://192.168.7.33/api/Usuario/info-usuario?infousuario=${selectedUser}`
    )
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error:", error));
  }, [selectedUser]);

  return (
    <div>
      <header>{projectName}</header>
      <div className="container">
        <ul>
          {motivationalPhrases.map((phrase, index) => (
            <li key={index}>{phrase}</li>
          ))}
        </ul>
        {/* Apartado de los involucrados */}
        <div className="team-section">
          <h3 className="mt-4">Involucrados en el proyecto</h3>
          <div className="buttons-container">
            {teamMembers.map((member, index) => (
              <button
                key={index}
                className="btn btn-primary m-2"
                onClick={() => toggleRole(index)}
              >
                {showRole[index] ? member.role : member.name}
              </button>
            ))}
          </div>
        </div>
        {/* termina  de los involucrados */}

        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Correo</th>
                <th>IdEjecutivo</th>
                <th>IdCartera</th>
                <th>IdProducto</th>
                <th>IdSegmento</th>
                <th>IdPuesto</th>
                <th>Intentos</th>
                <th>IdEncargado</th>
                <th>Descripcion</th>
                <th>IdArea</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((user, index) => (
                <tr key={index}>
                  <td>{user.Correo}</td>
                  <td>{user.IdEjecutivo}</td>
                  <td>{user.IdCartera}</td>
                  <td>{user.IdProducto}</td>
                  <td>{user.IdSegmento}</td>
                  <td>{user.IdPuesto}</td>
                  <td>{user.Intentos}</td>
                  <td>{user.IdEncargado}</td>
                  <td>{user.Descripcion}</td>
                  <td>{user.IdArea}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <footer>Gespa web 2025.</footer>
    </div>
  );
}
