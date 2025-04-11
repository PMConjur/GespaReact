import { useState } from "react";

export default function PhoneKeypad() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [lastPressed, setLastPressed] = useState(null);

  const handleNumberClick = (number) => {
    setPhoneNumber((prev) => {
      if (prev.replace(/-/g, "").length >= 13) return prev;
      return prev + number;
    });
    setLastPressed(number);

    setTimeout(() => setLastPressed(null), 300);
  };

  const handleDelete = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = () => {
    alert(`Calling ${phoneNumber}...`);
  };

  const formattedNumber = () => {
    if (phoneNumber.length === 0) return "";

    let formatted = phoneNumber;
    if (phoneNumber.length > 3 && phoneNumber.length <= 6) {
      formatted = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    } else if (phoneNumber.length > 6) {
      formatted = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
        3,
        6
      )}-${phoneNumber.slice(6)}`;
    }
    return formatted;
  };

  return (
    <div className="container-sm mt-5 p-4 bg-light rounded shadow">
      <div className="text-center mb-4">
        <h2 className="text-primary">Telefono</h2>
      </div>

      <div className="mb-3 position-relative">
        <input
          type="text"
          value={formattedNumber()}
          onChange={(e) => {
            const input = e.target.value.replace(/[^0-9]/g, ""); // Permitir solo números
            setPhoneNumber(input);
          }}
          className="form-control text-center fs-4 fw-bold"
          placeholder="Ingresa el numero de telefono"
        />
        {phoneNumber.length === 0 && (
          <div className="position-absolute top-50 start-50 translate-middle text-muted">
            <i className="bi bi-telephone"></i>
          </div>
        )}
      </div>

      <div className="row g-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => {
          const letters = getLetters(number);
          return (
            <div className="col-4 col-sm-3 col-md-2" key={number}>
              <button
                className={`btn btn-outline-primary w-100 py-3 ${
                  lastPressed === number.toString() ? "active" : ""
                }`}
                onClick={() => handleNumberClick(number.toString())}
              >
                <div>
                  <span className="fs-4 fw-bold">{number}</span>
                  {letters && <div className="text-muted small">{letters}</div>}
                </div>
              </button>
            </div>
          );
        })}
        <div className="col-4 col-sm-3 col-md-2">
          <button
            className="btn btn-outline-primary w-100 py-3"
            onClick={() => handleNumberClick("*")}
          >
            <span className="fs-4 fw-bold">*</span>
          </button>
        </div>
        <div className="col-4 col-sm-3 col-md-2">
          <button
            className="btn btn-outline-primary w-100 py-3"
            onClick={() => handleNumberClick("0")}
          >
            <div>
              <span className="fs-4 fw-bold">0</span>
              <div className="text-muted small">+</div>
            </div>
          </button>
        </div>
        <div className="col-4 col-sm-3 col-md-2">
          <button
            className="btn btn-outline-primary w-100 py-3"
            onClick={() => handleNumberClick("#")}
          >
            <span className="fs-4 fw-bold">#</span>
          </button>
        </div>
      </div>

      <div className="row g-2 mt-4">
        <div className="col-6">
          <button
            className="btn btn-outline-danger w-100 py-2"
            onClick={handleDelete}
          >
            <i className="bi bi-backspace me-2"></i> Delete
          </button>
        </div>
        <div className="col-6">
          <button className="btn btn-success w-100 py-2" onClick={handleCall}>
            <i className="bi bi-telephone me-2"></i> Call
          </button>
        </div>
      </div>
    </div>
  );
}

function getLetters(number) {
  const letterMap = {
    1: "",
    2: "ABC",
    3: "DEF",
    4: "GHI",
    5: "JKL",
    6: "MNO",
    7: "PQRS",
    8: "TUV",
    9: "WXYZ",
  };
  return letterMap[number] || "";
}
