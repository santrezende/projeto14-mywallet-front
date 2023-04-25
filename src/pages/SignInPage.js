import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import MyWalletLogo from "../components/MyWalletLogo";
import React, { useContext } from "react";
import axios from "axios";
import Context from "../Context";

export default function SignInPage() {
  const navigate = useNavigate();
  const context = useContext(Context);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const signInTemplate = {
    email,
    password,
  };

  React.useEffect(() => {
    if (context.lsToken || context.lsName) {
      navigate("/home");
    }
  });

  const signIn = (event) => {
    event.preventDefault();
    const promise = axios.post(process.env.REACT_APP_API_URL, signInTemplate);

    promise
      .then((res) => {
        context.setLsName(res.data.name);
        localStorage.setItem("name", res.data.name);
        context.setLsToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        navigate("/home");
      })
      .catch((error) => {
        alert(error.response.data);
      });
  };

  return (
    <SingInContainer>
      <form>
        <MyWalletLogo />
        <input
          required
          placeholder="E-mail"
          type="email"
          onChange={(event) => setEmail(event.target.value)}
          value={email}
        />
        <input
          required
          placeholder="Senha"
          type="password"
          autoComplete="new-password"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
        <button onClick={(event) => signIn(event)}>Entrar</button>
      </form>

      <Link to={"/cadastro"}>Primeira vez? Cadastre-se!</Link>
    </SingInContainer>
  );
}

const SingInContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
