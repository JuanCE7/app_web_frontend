import { UseCaseForm } from "../UseCaseForm";
import { UseCaseInformationProps } from "./UseCaseInformation.types";

export function UseCaseInformation(props: UseCaseInformationProps) {
  const { useCase } = props;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 lg:gap-x-10 gap-y-4">
      <div className="p-4 rounded-lg shadow-md bg-background hover:shadow-lg">
        <div>
          <UseCaseForm useCase={useCase} />
        </div>
      </div>
    </div>
  );
}
