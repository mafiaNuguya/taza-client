const Modal: React.FC = ({ children }) => {
  return (
    <div className="absolute flex justify-center items-center w-full h-full bg-black bg-opacity-60 z-[999]">
      {children}
    </div>
  );
};

export default Modal;
