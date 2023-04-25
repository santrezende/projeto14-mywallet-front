import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import MyWalletLogo from "../components/MyWalletLogo"
import React, { useContext } from "react"
import axios from "axios"
import Context from "../Context"

export default function SignUpPage() {
  const navigate = useNavigate()
  const context = useContext(Context)

  const url = "https://my-wallet-api-b0mr.onrender.com/cadastro";

  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [repeatPassword, setRepeatPassword] = React.useState("");

  const signUpTemplate = {
    name,
    email,
    password,
    repeatPassword
  }

  const signUp = (event) => {
    event.preventDefault();
    const promise = axios.post(url, signUpTemplate);

    promise
      .then(() => {
        alert("Usuário criado com sucesso! Realize o login com seu e-mail e senha!");
        navigate("/");
      })
      .catch((error) => {
        alert(error.response.data);
      });
  };

  React.useEffect(() => {
    if (context.lsToken || context.lsName) {
      navigate("/home")
    }
  }, [context.lsToken, context.lsName, navigate])

  return (
    <SingUpContainer>
      <form>
        <MyWalletLogo />
        <input placeholder="Nome" type="text" onChange={event => setName(event.target.value)} value={name} />
        <input placeholder="E-mail" type="email" onChange={event => setEmail(event.target.value)} value={email} />
        <input placeholder="Senha" type="password" autoComplete="new-password" onChange={event => setPassword(event.target.value)} value={password} />
        <input placeholder="Confirme a senha" type="password" autoComplete="new-password" onChange={event => setRepeatPassword(event.target.value)} value={repeatPassword} />
        <button onClick={(event) => signUp(event)}>Cadastrar</button>
      </form>

      <Link to={"/"}>
        Já tem uma conta? Entre agora!
      </Link>
    </SingUpContainer>
  )
}

const SingUpContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
