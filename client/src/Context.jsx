import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const data = {
    authUser,
    setAuthUser,
  };
  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
