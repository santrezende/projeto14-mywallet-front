import styled from "styled-components";
import React, { useContext } from "react";
import Context from "../Context";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function TransactionsPage() {
  const context = useContext(Context);
  const navigate = useNavigate();

  const { tipo } = useParams();

  const [value, setValue] = React.useState("");
  const [description, setDescription] = React.useState("");

  const transactionTemplate = {
    description,
    value,
  };

  const config = {
    headers: {
      Authorization: `Bearer ${context.lsToken}`,
    },
  };

  function createTransaction(event) {
    event.preventDefault();
    console.log(transactionTemplate);
    const promise = axios.post(
      `${process.env.REACT_APP_API_URL}nova-transacao/${tipo}`,
      transactionTemplate,
      config
    );

    promise
      .then(() => navigate("/home"))
      .catch((err) => alert(err.response.data));
  }

  React.useEffect(() => {
    if (!context.lsToken || !context.lsName) {
      navigate("/");
      alert("Faça Login!");
    }
  });

  // function createTransaction() {
  //   const promise = axios.post()
  // }

  return (
    <TransactionsContainer>
      <h1>Nova TRANSAÇÃO</h1>
      <form>
        <input
          required
          placeholder="Valor"
          type="text"
          onChange={(event) => setValue(event.target.value)}
          value={value}
        />
        <input
          required
          placeholder="Descrição"
          type="text"
          onChange={(event) => setDescription(event.target.value)}
          value={description}
        />
        <button onClick={(event) => createTransaction(event)}>
          Salvar TRANSAÇÃO
        </button>
      </form>
    </TransactionsContainer>
  );
}

const TransactionsContainer = styled.main`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  h1 {
    align-self: flex-start;
    margin-bottom: 40px;
  }
`;
