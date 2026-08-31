import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/AuthMutation";
import { useContext } from "react";
import { AuthContext } from "../context/Auth/AuthContext";

export function Logout(){
    const navigate = useNavigate()
    const authContext = useContext(AuthContext)
    useLogout()
    authContext?.logoutUsername()
    navigate('/login')
}