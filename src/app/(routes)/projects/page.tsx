import React from "react";
import { HeaderProjects } from "./components/HeaderProjects";
import ListProjects from "./components/ListProjects/ListProjects";

export function page() {
  
  return (
    <div>
      <HeaderProjects />
      <ListProjects />
    </div>
  );
}

export default page;
