import { HeaderTestCases } from "./components/HeaderTestCases";
import ListTestCases from "./components/ListTestCases/ListTestCases";

export default async function OpenProject({
  params,
}: {
  params: { useCaseId: string , projectId: string};
}) {

  return (
    <div className="p-4 mt-4 rounded-lg shadow-md bg-background">
      <HeaderTestCases useCaseId={params.useCaseId} projectId={params.projectId}/>
      <ListTestCases useCaseId={params.useCaseId} />
    </div>
  );
}
