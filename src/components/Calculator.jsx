import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Calculator = () => {
  const [displayValue, setDisplayValue] = useState("0");
  const [operator, setOperator] = useState(null);
  const [firstValue, setFirstValue] = useState(null);

  const handleNumberClick = (number) => {
    if (displayValue === "0") {
      setDisplayValue(number.toString());
    } else {
      setDisplayValue(displayValue + number.toString());
    }
  };

  const handleOperatorClick = (operatorValue) => {
    setOperator(operatorValue);
    setFirstValue(parseFloat(displayValue));
    setDisplayValue("0");
  };

  const handleEqualsClick = () => {
    if (operator && firstValue !== null) {
      const secondValue = parseFloat(displayValue);
      let result = 0;

      switch (operator) {
        case "+":
          result = firstValue + secondValue;
          break;
        case "-":
          result = firstValue - secondValue;
          break;
        case "*":
          result = firstValue * secondValue;
          break;
        case "/":
          result = firstValue / secondValue;
          break;
        default:
          break;
      }

      setDisplayValue(result.toString());
      setOperator(null);
      setFirstValue(null);
    }
  };

  const handleClearClick = () => {
    setDisplayValue("0");
    setOperator(null);
    setFirstValue(null);
  };

  return (
    <div className="calculator">
      <input
        type="text"
        className="form-control calculator-screen text-right mb-3"
        value={displayValue}
        readOnly
      />
      <div className="calculator-keys">
        <button
          type="button"
          value="7"
          className="btn btn-light"
          onClick={() => handleNumberClick(7)}
        >
          7
        </button>
        <button
          type="button"
          value="8"
          className="btn btn-light"
          onClick={() => handleNumberClick(8)}
        >
          8
        </button>
        <button
          type="button"
          value="9"
          className="btn btn-light"
          onClick={() => handleNumberClick(9)}
        >
          9
        </button>
        <button
          type="button"
          className="operator btn btn-info"
          value="+"
          onClick={() => handleOperatorClick("+")}
        >
          +
        </button>
        <button
          type="button"
          value="4"
          className="btn btn-light"
          onClick={() => handleNumberClick(4)}
        >
          4
        </button>
        <button
          type="button"
          value="5"
          className="btn btn-light"
          onClick={() => handleNumberClick(5)}
        >
          5
        </button>
        <button
          type="button"
          value="6"
          className="btn btn-light"
          onClick={() => handleNumberClick(6)}
        >
          6
        </button>
        <button
          type="button"
          className="operator btn btn-info"
          value="-"
          onClick={() => handleOperatorClick("-")}
        >
          -
        </button>
        <button
          type="button"
          value="1"
          className="btn btn-light"
          onClick={() => handleNumberClick(1)}
        >
          1
        </button>
        <button
          type="button"
          value="2"
          className="btn btn-light"
          onClick={() => handleNumberClick(2)}
        >
          2
        </button>
        <button
          type="button"
          value="3"
          className="btn btn-light"
          onClick={() => handleNumberClick(3)}
        >
          3
        </button>
        <button
          type="button"
          className="operator btn btn-info"
          value="*"
          onClick={() => handleOperatorClick("*")}
        >
          ×
        </button>
        <button
          type="button"
          value="0"
          className="btn btn-light"
          onClick={() => handleNumberClick(0)}
        >
          0
        </button>
        <button
          type="button"
          className="decimal btn btn-secondary"
          value="."
          onClick={() => handleNumberClick(".")}
        >
          .
        </button>
        <button
          type="button"
          className="all-clear btn btn-danger"
          value="all-clear"
          onClick={handleClearClick}
        >
          AC
        </button>
        <button
          type="button"
          className="operator btn btn-info"
          value="/"
          onClick={() => handleOperatorClick("/")}
        >
          ÷
        </button>
        <button
          type="button"
          className="equal-sign operator btn btn-primary"
          value="="
          onClick={handleEqualsClick}
        >
          =
        </button>
      </div>
    </div>
  );
};

export default Calculator;
