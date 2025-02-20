import React from "react";
import { FormControl, Alert, Button, NavDropdown } from "react-bootstrap";
import { Search, ArrowRepeat } from "react-bootstrap-icons";


const SearchForm = ({
  handleSearch,
  searchTerm,
  handleInputChange,
  errorMessage,
  showSuggestions,
  setShowSuggestions, 
  suggestions,
  handleSuggestionClick,
  filter,
  handleFilterSelect,
  handleAutomaticSearch,
  idEjecutivo,
}) => {
  
  return (
    <form
      className="d-flex"
      style={{ gap: "10px", alignItems: "center", margin: "0 auto" }}
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
    >
      <div style={{ position: "relative", width: "300px" }}>
        <FormControl
          style={{ width: "100%", backgroundColor: "white", paddingLeft: "35px", color: "black" }}
          type="search"
          placeholder="Buscar"
          className="custom-placeholder me-2"
          aria-label="Search"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <Search style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "black" }} />
        {errorMessage && <Alert variant="danger" className="position-absolute w-100">{errorMessage}</Alert>}
        {showSuggestions && suggestions.length > 0 && (
          <div className="position-absolute w-100 bg-white border border-secondary" style={{ maxHeight: "300px", overflowY: "auto", zIndex: 1000 }}>
            {suggestions.map((suggestion, index) => (
              <div key={index} onClick={() => handleSuggestionClick(suggestion)} className="p-2 cursor-pointer">
                {suggestion.nombreDeudor}
              </div>
            ))}
          </div>
        )}
      </div>

      <Button variant="light">
        <NavDropdown title={`Seleccionar filtro: ${filter}`} id="filter-dropdown" onSelect={handleFilterSelect}>
          {["Cuenta", "Nombre", "RFC", "Numero de cliente", "Telefono", "Expediente"].map((item) => (
            <NavDropdown.Item key={item} eventKey={item}>{item}</NavDropdown.Item>
          ))}
        </NavDropdown>
      </Button>

      <Button className="d-none d-md-block " variant="primary" type="button" onClick={handleAutomaticSearch}>
        <ArrowRepeat className="me-2"/>
        <span>Automático</span>
      </Button>
    </form>
  );
};

export default SearchForm;