"use client";

import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Widgets.css";

export function Calculator() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNumber = (num) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (operator) => {
    setEquation(display + operator);
    setIsNewNumber(true);
  };

  const handleEquals = () => {
    try {
      const result = eval(equation + display);
      setDisplay(String(result));
      setEquation("");
      setIsNewNumber(true);
    } catch (error) {
      setDisplay("Error");
      setEquation("");
      setIsNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
    setIsNewNumber(true);
  };

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
      setIsNewNumber(false);
    }
  };

  return (
    <div className="container d-flex justify-content-end align-items-center min-vh-100">
      <div
        className="card"
        style={{
          maxWidth: "250px", // Reducir el tamaño a la mitad
          width: "50%", // Reducir el tamaño a la mitad
          backgroundColor: "#212529",
          border: "1px solid #444",
        }}
      >
        <div className="card-body p-1">
          {" "}
          {/* Reducir el padding */}
          <div className="Calculadora">
            <div className="row mb-1">
              {" "}
              {/* Reducir el margen */}
              <div className="col-12">
                <div
                  className="w-100 text-end p-1 rounded"
                  style={{
                    backgroundColor: "#333",
                    color: "white",
                    minHeight: "24px", // Reducir el tamaño a la mitad
                    fontSize: "0.75rem", // Reducir el tamaño de la fuente a la mitad
                  }}
                >
                  {display}
                </div>
              </div>
            </div>

            <div className="row g-1">
              <div className="col-3">
                <button
                  className="btn w-100 py-1"
                  style={{ backgroundColor: "#666", color: "white" }}
                  onClick={() => handleNumber("7")}
                >
                  7
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn w-100 py-1"
                  style={{ backgroundColor: "#666", color: "white" }}
                  onClick={() => handleNumber("8")}
                >
                  8
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn w-100 py-1"
                  style={{ backgroundColor: "#666", color: "white" }}
                  onClick={() => handleNumber("9")}
                >
                  9
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn w-100 py-1"
                  style={{ backgroundColor: "#666", color: "white" }}
                  onClick={() => handleOperator("+")}
                >
                  +
                </button>
              </div>
            </div>

            <div className="row g-1 mt-1">
              <div className="col-3">
                <button
                  className="btn w-100 py-1"
                  style={{ backgroundColor: "#666", color: "white" }}
                  onClick={() => handleNumber("4")}
                >
                  4
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn w-100 py-1"
                  style={{ backgroundColor: "#666", color: "white" }}
                  onClick={() => handleNumber("5")}
                >
                  5
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn w-100 py-1"
                  style={{ backgroundColor: "#666", color: "white" }}
                  onClick={() => handleNumber("6")}
                >
                  6
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn w-100 py-1"
                  style={{ backgroundColor: "#666", color: "white" }}
                  onClick={() => handleOperator("-")}
                >
                  -
                </button>
              </div>
            </div>

            <div className="row g-1 mt-1">
              <div className="col-3">
                <button
                  className="btn w-100 py-1"
                  style={{ backgroundColor: "#666", color: "white" }}
                  onClick={() => handleNumber("1")}
                >
                  1
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn w-100 py-1"
                  style={{ backgroundColor: "#666", color: "white" }}
                  onClick={() => handleNumber("2")}
                >
                  2
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn w-100 py-1"
                  style={{ backgroundColor: "#666", color: "white" }}
                  onClick={() => handleNumber("3")}
                >
                  3
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn w-100 py-1"
                  style={{ backgroundColor: "#666", color: "white" }}
                  onClick={() => handleOperator("*")}
                >
                  ×
                </button>
              </div>
            </div>

            <div className="row g-1 mt-1">
              <div className="col-3">
                <button
                  className="btn w-100 py-1"
                  style={{ backgroundColor: "#666", color: "white" }}
                  onClick={() => handleNumber("0")}
                >
                  0
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn w-100 py-1"
                  style={{ backgroundColor: "#666", color: "white" }}
                  onClick={handleDecimal}
                >
                  .
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn w-100 py-1"
                  style={{ backgroundColor: "#666", color: "white" }}
                  onClick={handleClear}
                >
                  AC
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn w-100 py-1"
                  style={{ backgroundColor: "#666", color: "white" }}
                  onClick={() => handleOperator("/")}
                >
                  /
                </button>
              </div>
            </div>

            <div className="row g-1 mt-1">
              <div className="col-12">
                <button
                  className="btn w-100 py-1"
                  style={{ backgroundColor: "#666", color: "white" }}
                  onClick={handleEquals}
                >
                  =
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Calendar = () => {
  // 📌 Estados para manejar la fecha seleccionada, el mes y el año
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(2025);

  // 📌 Calcula la cantidad de días en el mes actual
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();

  // 📌 Funciones para manejar eventos
  const handleDateClick = (day) => setSelectedDate(day);
  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
    setSelectedDate(null);
  };
  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
    setSelectedDate(null);
  };

  // 📌 Generar la estructura de la tabla del calendario
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<td key={`empty-${i}`} className="empty"></td>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(
      <td
        key={day}
        className={`calendar-day ${selectedDate === day ? "highlight" : ""}`}
        onClick={() => handleDateClick(day)}
      >
        {day}
      </td>
    );
  }

  // 📌 Organizar los días en semanas
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(<tr key={i}>{calendarDays.slice(i, i + 7)}</tr>);
  }

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{
        width: "10vw",
        height: "10vh",
        backgroundColor: "#212529",
        color: "white",
      }}
    >
      <div
        className="card p-4"
        style={{
          maxWidth: "900px",
          width: "90%",
          backgroundColor: "#212529",
          border: "1px solid #444",
          color: "white",
        }}
      >
        {/* 📌 Controles de selección de mes y año */}
        <div className="d-flex justify-content-between mb-3">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="form-select"
            calendar-month {
              font-size: 22px !important;
              color: #f8f9fa !important;
            }
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={selectedYear}
            onChange={handleYearChange}
            min="1900"
            max="2100"
            className="form-control"
            style={{ width: "120px" }}
          />
        </div>

        {/* 📌 Tabla del calendario */}
        <table className="table table-bordered text-center table-dark">
          <thead className="table-light">
            <tr>
              <th>Dom</th>
              <th>Lun</th>
              <th>Mar</th>
              <th>Mié</th>
              <th>Jue</th>
              <th>Vie</th>
              <th>Sáb</th>
            </tr>
          </thead>
          <tbody>{weeks}</tbody>
        </table>

        {/* 📌 Muestra la fecha seleccionada */}
        {selectedDate && (
          <p className="text-center mt-3">
            Fecha seleccionada:{" "}
            <strong>
              {selectedDate} de{" "}
              {new Date(selectedYear, selectedMonth).toLocaleString("default", {
                month: "long",
              })}{" "}
              del año {selectedYear}
            </strong>
          </p>
        )}
      </div>
    </div>
  );
};

export { Calendar };