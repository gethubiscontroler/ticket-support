import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            // Stocker le JWT dans localStorage
            localStorage.setItem("jwt", token);
            navigate("/dashboard"); // rediriger vers ton tableau de bord
        } else {
            navigate("/login");
        }
    }, []);

    return <div>Connexion réussie, redirection...</div>;
}

