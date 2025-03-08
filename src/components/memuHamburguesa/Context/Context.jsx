// import { createContext, useContext, useState } from "react";
// import PropTypes from "prop-types";

// // Crear el contexto principal
// export const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filter, setFilter] = useState("Cuenta");
//   const [searchResults, setSearchResults] = useState([]);
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [user, setUser] = useState("");
//   const [password, setPassword] = useState("");
//   const [showToast, setShowToast] = useState(false);
//   const [numeroTelefonico, setNumeroTelefonico] = useState("");
//   const [flowMessage, setFlowMessage] = useState("");

//   const contextValue = {
//     searchTerm,
//     setSearchTerm,
//     filter,
//     setFilter,
//     searchResults,
//     setSearchResults,
//     suggestions,
//     setSuggestions,
//     showSuggestions,
//     setShowSuggestions,
//     errorMessage,
//     setErrorMessage,
//     user,
//     setUser,
//     password,
//     setPassword,
//     showToast,
//     setShowToast,
//     numeroTelefonico,
//     setNumeroTelefonico,
//     flowMessage,
//     setFlowMessage,
//   };

//   return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
// };

// AppProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// // Hook personalizado para consumir el contexto
// export const useAppContext = () => {
//   return useContext(AppContext);
// };
