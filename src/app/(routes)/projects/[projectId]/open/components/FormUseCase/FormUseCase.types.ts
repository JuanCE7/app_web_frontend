import { Dispatch, SetStateAction } from "react";

export type FormUseCaseProps = {
  setOpenModalCreate: Dispatch<SetStateAction<boolean>>;
  projectId: string;
  useCaseId?: string;
};
