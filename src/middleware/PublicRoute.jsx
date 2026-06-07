import { Navigate } from "react-router-dom";

export default function PublicRoute({children}){
    const email = localStorage.getItem("email")
    const session_id = localStorage.getItem("session_id")

    console.log(email)
    console.log(session_id)

    console.log(children)

    if(session_id && email){
        return(<Navigate to="/dashboard" replace />);
    }

    return children;
}