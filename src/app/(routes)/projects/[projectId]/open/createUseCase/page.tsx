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
  if (!useCase) {
    return redirect("/");
  }

  return (
    <div>
      <HeaderUseCase projectId={params.projectId} />
      <UseCaseInformation useCase={useCase}/>
    </div>
  );
}
