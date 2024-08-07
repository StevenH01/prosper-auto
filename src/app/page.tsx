import React from "react";
import CarAnimation from "./components/loading/CarAnimation";
import { NavBar } from "./components/NavBar";
import LandingPage from "./components/landing/Page";

export default function Home() {
  return (
    <div className="">
      <NavBar />
      <LandingPage />
    </div>
  );
}
