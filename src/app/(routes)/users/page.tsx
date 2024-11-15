import ListUsers from "./components/ListUsers/ListUsers";

export function page() {
  return (
    <div className="p-4 mt-4 rounded-lg shadow-md bg-background">
      <h2 className="text-2xl">Lista de Usuarios</h2>
      <ListUsers />
    </div>
  );
}

export default page;
