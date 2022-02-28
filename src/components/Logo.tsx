import React from "react";

export default function Logo() {
  return (
    <div className="relative w-28 h-28 bg-primary-gray rounded-full">
      <div className="absolute top-[3.8rem] left-8 rotate-6">
        <div className="animate-bounce">
          <img src="/assests/sunglass.png" width={50} />
        </div>
      </div>
      <img src="/assests/logo.png" />
    </div>
  );
}
