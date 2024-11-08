import { Dispatch, SetStateAction } from "react";

export type FormProjectProps = {
  setOpenModalCreate: Dispatch<SetStateAction<boolean>>;
  projectId?: string;
};
