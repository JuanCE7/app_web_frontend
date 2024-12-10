import { Dispatch, SetStateAction } from "react";

export type FormProjectProps = {
  setOpenModalCreate: Dispatch<boolean>;
  projectId?: string;
};
