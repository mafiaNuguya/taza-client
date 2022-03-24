import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider as AlertProvider } from "react-alert";

import Alert, { alertOption } from "./components/Alert";
import ModalProvider from "./libs/Modal/Provider";

import "./index.css";
import App from "./App";
import Home from "./pages/Home";
import Waiting from "./pages/Waiting";
import Game from "./pages/Game";
import GameProvider from "./libs/connection/Game/Provider";

ReactDOM.render(
  <BrowserRouter>
    <ModalProvider>
      <AlertProvider template={Alert} {...alertOption}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="/waiting" element={<Waiting />} />
            <Route
              path="/game/:gameId"
              element={
                <GameProvider>
                  <Game />
                </GameProvider>
              }
            />
          </Route>
        </Routes>
      </AlertProvider>
    </ModalProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
