import { Dispatch, SetStateAction } from "react";

export type FormTestCaseProps = {
  setOpenModalCreate: Dispatch<SetStateAction<boolean>>;
  useCaseId?: string;
  testCaseId?: string;
};
