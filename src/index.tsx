import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider as AlertProvider } from "react-alert";

import "./index.css";
import App from "./App";
import Home from "./pages/Home";
import Alert, { alertOption } from "./components/Alert";
import ModalProvider from "./components/Modal/Provider";

ReactDOM.render(
  <ModalProvider>
    <AlertProvider template={Alert} {...alertOption}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AlertProvider>
  </ModalProvider>,
  document.getElementById("root")
);
