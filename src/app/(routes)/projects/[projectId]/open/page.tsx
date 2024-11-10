import ListUseCases from "./components/ListUseCases/ListUseCases";
import { HeaderUseCases } from "./components/HeaderUseCases";

export default async function OpenProject({
  params,
}: {
  params: { projectId: string };
}) {

  return (
    <div className="p-4 mt-4 rounded-lg shadow-md bg-background">
      <HeaderUseCases projectId={params.projectId}/>
      <ListUseCases projectId={params.projectId} />
    </div>
  );
}
