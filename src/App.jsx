import "./App.css";
import MainPage from "./pages/MainPage";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import Layout from "./components/Layout";


function App() {
  return (
    <div className="App"> 
    {/* <MainPage/> */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main-page/*" element={<MainPage />}/>
      </Routes>
    </div>
  );
}

export default App;