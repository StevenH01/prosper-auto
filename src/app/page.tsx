import React from "react";
import { NavBar } from "./components/NavBar";
import LandingPage from "./components/landing/Page";
import { AnnouncementBanner } from "./components/AnnouncementBanner";

export default function Home() {
  return (
    <div className="">
      <AnnouncementBanner />
      <NavBar />
      <LandingPage />
    </div>
  );
}
