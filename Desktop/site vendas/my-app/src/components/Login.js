import React, { useState } from "react";
import axios from "axios";
import './Login.css'; // Importe o arquivo CSS

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
        onLogin(); 
      } else {
        setError("Login falhou: nenhum token retornado.");
      }
    } catch (err) {
      setError("Credenciais inválidas. Tente novamente.");
      console.error("Erro no login:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <div className="logo">
            <h2>MINHA LOJA</h2>
          </div>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="Email"
              required
            />
            <span className="input-label">Email</span>
          </div>

          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Senha"
              required
            />
            <span className="input-label">Senha</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`login-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? "Carregando..." : "Entrar"}
          </button>

          {error && <p className="error-message">{error}</p>}
        </form>

        <p className="register-link">
          Novo aqui? <a href="/register" className="register-link-text">Crie uma conta</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
