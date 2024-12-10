"use client";

import React from "react";

export const LoadingSpinner: React.FC = ({}) => {
  return (
    <div className="flex flex-col justify-center items-center mb-4">
      <b>CARGANDO...</b>
      <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
};
