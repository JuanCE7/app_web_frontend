import { Dispatch, SetStateAction } from "react";

export type CardGenerateTestCaseProps = {
  setOpenModalGenerate: Dispatch<SetStateAction<boolean>>;
  useCaseId?: string;
  testCaseId?: string;
};
