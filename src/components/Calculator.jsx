import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Calculadora = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState(null);
  const [firstValue, setFirstValue] = useState(null);

  const handleNumberClick = (number) => {
    if (displayValue === '0') {
      setDisplayValue(number.toString());
    } else {
      setDisplayValue(displayValue + number.toString());
    }
  };

  const handleOperatorClick = (operatorValue) => {
    setOperator(operatorValue);
    setFirstValue(parseFloat(displayValue));
    setDisplayValue('0');
  };

  const handleEqualsClick = () => {
    if (operator && firstValue !== null) {
      const secondValue = parseFloat(displayValue);
      let result = 0;

      switch (operator) {
        case '+':
          result = firstValue + secondValue;
          break;
        case '-':
          result = firstValue - secondValue;
          break;
        case '*':
          result = firstValue * secondValue;
          break;
        case '/':
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
    setDisplayValue('0');
    setOperator(null);
    setFirstValue(null);
  };

  const buttonStyle = {
    padding: '5px',
    fontSize: '1.2em',
    width: '100%',
  };

  const inputStyle = {
    fontSize: '2em',
    padding: '5px',
    width: '100%',
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="p-4"> {/* Se ha quitado la clase "border" */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control text-right"
                value={displayValue}
                readOnly
                style={inputStyle}
              />
            </div>
            <div className="row">
              <div className="col-3">
                <button
                  className="btn btn-light btn-block mb-3"
                  style={buttonStyle}
                  onClick={() => handleNumberClick(7)}
                >
                  7
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn btn-light btn-block mb-3"
                  style={buttonStyle}
                  onClick={() => handleNumberClick(8)}
                >
                  8
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn btn-light btn-block mb-3"
                  style={buttonStyle}
                  onClick={() => handleNumberClick(9)}
                >
                  9
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn btn-warning btn-block mb-3"
                  style={buttonStyle}
                  onClick={() => handleOperatorClick('/')}
                >
                  /
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-3">
                <button
                  className="btn btn-light btn-block mb-3"
                  style={buttonStyle}
                  onClick={() => handleNumberClick(4)}
                >
                  4
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn btn-light btn-block mb-3"
                  style={buttonStyle}
                  onClick={() => handleNumberClick(5)}
                >
                  5
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn btn-light btn-block mb-3"
                  style={buttonStyle}
                  onClick={() => handleNumberClick(6)}
                >
                  6
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn btn-warning btn-block mb-3"
                  style={buttonStyle}
                  onClick={() => handleOperatorClick('*')}
                >
                  *
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-3">
                <button
                  className="btn btn-light btn-block mb-3"
                  style={buttonStyle}
                  onClick={() => handleNumberClick(1)}
                >
                  1
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn btn-light btn-block mb-3"
                  style={buttonStyle}
                  onClick={() => handleNumberClick(2)}
                >
                  2
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn btn-light btn-block mb-3"
                  style={buttonStyle}
                  onClick={() => handleNumberClick(3)}
                >
                  3
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn btn-warning btn-block mb-3"
                  style={buttonStyle}
                  onClick={() => handleOperatorClick('-')}
                >
                  -
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-3">
                <button
                  className="btn btn-secondary btn-block mb-3"
                  style={buttonStyle}
                  onClick={handleClearClick}
                >
                  C
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn btn-light btn-block mb-3"
                  style={buttonStyle}
                  onClick={() => handleNumberClick(0)}
                >
                  0
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn btn-success btn-block mb-3"
                  style={buttonStyle}
                  onClick={handleEqualsClick}
                >
                  =
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn btn-warning btn-block mb-3"
                  style={buttonStyle}
                  onClick={() => handleOperatorClick('+')}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculadora;
