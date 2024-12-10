import { Dispatch } from "react";

export type GeneratePDFProps = {
  setOpenModalGenerate: Dispatch<boolean>;
  projectId?: string;
};
