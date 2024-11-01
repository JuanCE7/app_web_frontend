import { redirect } from "next/navigation";
import { UseCaseInformation } from "./components/UseCaseInformation";
import { getUseCaseById } from "../useCases.api";
import { HeaderUseCase } from "./components/HeaderUseCase";

export default async function OpenUseCase({
  params,
}: {
  params: { projectId: string , useCaseId: string};
}) {
  const useCase = await getUseCaseById(params.useCaseId);

  return (
    <div>
      <HeaderUseCase projectId={params.projectId} useCaseId={params.useCaseId}/>
      <UseCaseInformation useCase={useCase}/>
    </div>
  );
}
