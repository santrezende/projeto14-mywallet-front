import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import TransactionsPage from "./pages/TransactionPage";
import Context from "./Context";
import React from "react";

export default function App() {
  const [lsName, setLsName] = React.useState(localStorage.getItem("name"));
  const [lsToken, setLsToken] = React.useState(localStorage.getItem("token"));

  const contextValue = { lsName, lsToken, setLsName, setLsToken };

  return (
    <PagesContainer>
      <Context.Provider value={contextValue}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignInPage />} />
            <Route path="/cadastro" element={<SignUpPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route
              path="/nova-transacao/:tipo"
              element={<TransactionsPage />}
            />
          </Routes>
        </BrowserRouter>
      </Context.Provider>
    </PagesContainer>
  );
}

const PagesContainer = styled.main`
  background-color: #8c11be;
  width: calc(100vw - 50px);
  max-height: 100vh;
  padding: 25px;
`;
