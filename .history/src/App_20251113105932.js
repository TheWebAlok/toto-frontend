import { useState } from "react";
import Navbar from "./components/Navbar";
import Todo from "./pages/Todo";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  const [searchText, setSearchText] = useState("");
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/signup"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && (
        <Navbar onSearch={(text) => setSearchText(text)} />
      )}

      <Routes>
        <Route path="/" element={<Home searchText={searchText} />} />
        <Route path="/todo" element={<Todo searchText={searchText} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
