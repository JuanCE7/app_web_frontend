import { HeaderProjects } from "./components/HeaderProjects";
import ListProjects from "./components/ListProjects/ListProjects";

export function page() {
  return (
    <div className="p-4 mt-4 rounded-lg shadow-md bg-background">
      <HeaderProjects />
      <ListProjects />
    </div>
  );
}

export default page;
