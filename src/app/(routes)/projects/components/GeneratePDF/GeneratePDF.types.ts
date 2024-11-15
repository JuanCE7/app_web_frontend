import { Dispatch, SetStateAction } from "react";

export type GeneratePDFProps = {
  setOpenModalGenerate: Dispatch<SetStateAction<boolean>>;
  projectId?: string;
};
