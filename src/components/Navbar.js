import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const nav = useNavigate()
    return (
        <div className="navbar">
            <div onClick={() => nav('/')}>Home</div>
            <div onClick={() => nav('/release')}>Release Info</div>
        </div>
    )

}

export default Navbar