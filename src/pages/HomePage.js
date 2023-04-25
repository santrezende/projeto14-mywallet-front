import styled from "styled-components";
import { BiExit } from "react-icons/bi";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import Context from "../Context";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
  const context = useContext(Context);
  const navigate = useNavigate();

  const [transactions, setTransactions] = React.useState([]);
  const [finalBalance, setFinalBalance] = React.useState(0);

  React.useEffect(() => {
    if (!context.lsToken || !context.lsName) {
      navigate("/");
      alert("Faça Login!");
    }
    getTransactions();
  });

  function getTransactions() {
    const config = {
      headers: {
        Authorization: `Bearer ${context.lsToken}`,
      },
    };

    const promise = axios.get(`${process.env.REACT_APP_API_URL}home`, config);
    promise
      .then((res) => {
        setTransactions(res.data.reverse());

        const positiveFilteredValues = res.data
          .filter((t) => t.type === "entrada")
          .map((t) => parseFloat(t.value));
        const negativeFilteredValues = res.data
          .filter((t) => t.type === "saida")
          .map((t) => parseFloat(t.value));

        const positiveBalance = positiveFilteredValues.reduce(
          (total, value) => total + value,
          0
        );
        const negativeBalance = negativeFilteredValues.reduce(
          (total, value) => total + value,
          0
        );

        setFinalBalance(positiveBalance - negativeBalance);
      })
      .catch((error) => console.log(error.response.data));
  }

  function logOut() {
    const config = {
      headers: {
        Authorization: `Bearer ${context.lsToken}`,
      },
    };
    const promise = axios.delete(
      `${process.env.REACT_APP_API_URL}home`,
      config
    );
    promise
      .then(() => {
        context.setLsToken(null);
        localStorage.removeItem("token");
        context.setLsName(null);
        localStorage.removeItem("name");
        navigate("/");
      })
      .catch((err) => console.log(err.response.data));
  }

  function deleteTransaction(transactionId) {
    const shouldDelete = window.confirm(
      "Tem certeza que deseja excluir esta transação?"
    );
    if (!shouldDelete) {
      return;
    }

    const config = {
      data: { id: transactionId },
      headers: { Authorization: `Bearer ${context.lsToken}` },
    };
    const promise = axios.delete(
      `${process.env.REACT_APP_API_URL}deletar`,
      config
    );

    promise
      .then(() => getTransactions())
      .catch((err) => console.log(err.response.data));
  }

  return (
    <HomeContainer>
      <Header>
        <h1>Olá, {context.lsName}</h1>
        <BiExit onClick={logOut} />
      </Header>

      <TransactionsContainer>
        <ul>
          {transactions.map((t) => (
            <ListItemContainer key={t._id}>
              <div>
                <span>{t.date}</span>
                <strong>{t.description}</strong>
              </div>
              <div>
                <Value color={t.type === "entrada" ? "positivo" : "negativo"}>
                  {parseFloat(t.value).toFixed(2)}
                </Value>
                <ion-icon
                  onClick={() => deleteTransaction(t._id)}
                  name="close"
                ></ion-icon>
              </div>
            </ListItemContainer>
          ))}
        </ul>

        <article>
          <strong>Saldo</strong>
          <Value color={finalBalance >= 0 ? "positivo" : "negativo"}>
            {finalBalance.toFixed(2)}
          </Value>
        </article>
      </TransactionsContainer>

      <ButtonsContainer>
        <button onClick={() => navigate("/nova-transacao/entrada")}>
          <AiOutlinePlusCircle />
          <p>
            Nova <br /> entrada
          </p>
        </button>
        <button onClick={() => navigate("/nova-transacao/saida")}>
          <AiOutlineMinusCircle />
          <p>
            Nova <br />
            saída
          </p>
        </button>
      </ButtonsContainer>
    </HomeContainer>
  );
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`;
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
`;
const TransactionsContainer = styled.article`
  flex-grow: 1;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  article {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    bottom: -16px;
    background-color: #fff;
    padding: 8px;
    margin-top: 16px;
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`;
const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;

  button {
    width: 50%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 18px;
    }
  }
`;
const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${(props) => (props.color === "positivo" ? "green" : "red")};
`;
const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
  div {
    display: flex;
    justify-content: space-between;
  }
  ion-icon {
    margin-left: 10px;
    right: 0;
    cursor: pointer;
  }
`;
