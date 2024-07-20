import React from "react";
import CarAnimation from "./components/CarAnimation";

export default function Home() {
  return (
    <div className="justify-center h-screen items-center">
      <h2 className="flex justify-center text-2xl p-4">
        Welcome to Prosper Auto!
      </h2>
      <div className="flex justify-center text-xl">
        Website In Developement.
      </div>
      <CarAnimation />
    </div>
  );
}
