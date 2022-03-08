import React, { useState, useContext, createContext } from "react";

import Modal from "./Modal";

type Modal = {
  isOpen: boolean;
  component: React.ReactNode;
  open: (component: React.ReactNode) => void;
  close: (...any: any) => void;
};

const initialState: Modal = {
  isOpen: false,
  component: null,
  open: () => {},
  close: () => {},
};
const ModalContext = createContext<Modal>(initialState);

const useProvideModal = (): Modal => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [component, setComponent] = useState<React.ReactNode>();

  const open = (component: React.ReactNode) => {
    setOpen(true);
    setComponent(component);
  };
  const close = () => setOpen(false);

  return {
    isOpen,
    component,
    open,
    close,
  };
};

const ModalProvider: React.FC = ({ children }) => {
  const modal = useProvideModal();

  return (
    <ModalContext.Provider value={modal}>
      {modal.isOpen && <Modal>{modal.component}</Modal>}
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

export default ModalProvider;
