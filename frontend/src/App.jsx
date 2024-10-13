import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import UserAuth from "./components/UserAuth";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import { createContext } from "react";
import { lookInSession } from "./utils/sessionStorage";
import EditorPage from "./pages/EditorPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import UserPage from "./pages/UserPage";
import BlogPage from "./pages/BlogPage";

axios.defaults.baseURL = "https://blogcms-3r1s.onrender.com";
export const UserContext = createContext({});

function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    let userInSession = lookInSession("user");

    if (userInSession) {
      setUser({ ...JSON.parse(userInSession) });
    } else {
      setUser({ accessToken: null });
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/" element={<Navbar />}>
          <Route path="" element={<HomePage />} />
          <Route path="sign-in" element={<UserAuth type={"sign-in"} />} />
          <Route path="sign-up" element={<UserAuth type={"sign-up"} />} />
          <Route path="search/:query" element={<SearchPage />} />
          <Route path="user/:id" element={<UserPage />} />
          <Route path=":timeStamp/:blogId" element={<BlogPage />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
