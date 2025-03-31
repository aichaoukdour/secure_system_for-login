import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import inwiLogo from "./logo.webp";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check empty fields
    if (!email.trim() || !password.trim()) {
      setErrorMessage("L'email et le mot de passe ne peuvent pas être vides.");
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setErrorMessage("Veuillez entrer un email valide (exemple@gmail.com).");
      return;
    }

    setErrorMessage(""); // Reset error message

    const loginData = { email, password };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      console.log("📡 Server Response:", data); // Log full response

      if (!response.ok) {
        throw new Error(data.error || "Identifiants invalides ou serveur indisponible");
      }

      if (data.access) {  // ✅ Fixed: Check "access" instead of "access_token"
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        console.log("✅ Access Token:", data.access);
        console.log("🔄 Refresh Token:", data.refresh);

        // Show success message before redirecting
        setSuccessMessage("✅ Connexion réussie ! Redirection...");

        setTimeout(() => {
          window.location.href = "/dashboard"; // Redirect after 2 sec
        }, 2000);
      } else {
        setErrorMessage("Identifiants incorrects, veuillez réessayer.");
      }
    } catch (error) {
      console.error("❌ Error:", error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: "rgb(240, 193, 249)" }}>
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 backdrop-blur-md">
        {/* Logo */}
        <div className="flex justify-center border-b pb-2 mb-4">
          <img src={inwiLogo} alt="Inwi" className="h-8" />
        </div>

        <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
          <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm">
            <FaUser className="text-[#9B26B6] mr-3" />
            <input
              type="text"
              placeholder="Email"
              className="bg-transparent w-full focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm">
            <FaLock className="text-[#9B26B6] mr-3" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent w-full focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

          {/* Success Message */}
          {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

          <button type="submit" className="w-full bg-[#9B26B6] text-white py-3 rounded-lg hover:bg-[#8C1FA3] transition-all shadow-md">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
