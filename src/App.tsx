import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="w-full h-[100vh] flex items-center overscroll-y-none bg-zinc-800 space-x-2">
      <Outlet />
    </div>
  );
}
