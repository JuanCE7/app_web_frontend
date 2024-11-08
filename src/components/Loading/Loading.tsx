"use client";
import Image from "next/image";

export function Loading() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="loader">Cargando...</div>
    </div>
  );
}
