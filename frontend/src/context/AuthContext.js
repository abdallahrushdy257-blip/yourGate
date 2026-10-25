import { createContext, useEffect, useState } from "react";
import API from "../api/axiosConfig";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  async function getUser() {
    const res = await API.get("/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res;

    if (res.status === 200) {
      setUser(data.data);
    }
  }

  useEffect(() => {
    if (token) {
      getUser();
    }
  }, [token]);
  return (
    <AppContext.Provider value={{ token, setToken, user, setUser , Permissions : user ? user.roles : []}}>
      {children}
    </AppContext.Provider>
  );
}