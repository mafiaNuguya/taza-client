import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider as AlertProvider } from "react-alert";

import WebSocketSessionProvider from "./libs/webSocketSession/Provider";
import Alert, { alertOption } from "./components/Alert";
import ModalProvider from "./components/Modal/Provider";

import "./index.css";
import App from "./App";
import Home from "./pages/Home";
import Waiting from "./pages/Waiting";

ReactDOM.render(
  <ModalProvider>
    <AlertProvider template={Alert} {...alertOption}>
      <WebSocketSessionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              <Route path="/waiting" element={<Waiting />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WebSocketSessionProvider>
    </AlertProvider>
  </ModalProvider>,
  document.getElementById("root")
);
