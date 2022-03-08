export const handleLeaveEvent = (e: BeforeUnloadEvent) => {
  e.preventDefault();
  e.returnValue = "";
};

const useLeavePage = () => ({
  enable: () => window.addEventListener("beforeunload", handleLeaveEvent),
  disable: () => window.removeEventListener("beforeunload", handleLeaveEvent),
});

export default useLeavePage;
