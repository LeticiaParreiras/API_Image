import { Routes, Route} from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import Home from "./pages/home";
import { UserPage } from "./pages/UserPage";



export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile/:username" element={<UserPage/>}/>
    </Routes>
  );
}
