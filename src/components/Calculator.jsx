import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Widgets.css";
import { Card } from "react-bootstrap";
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
    <Card>
      <div
        style={{
          maxWidth: "100%", // Reducir el tamaño a la mitad
          width: "100%", // Reducir el tamaño a la mitad
          
         
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
                    fontSize: "0.75rem" // Reducir el tamaño de la fuente a la mitad
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
    </Card>
  );
}
export default Calculator;
