"use client";

import { toast } from "@/hooks/use-toast";
import {
  createProject,
  getProjectById,
  updateProject,
} from "../../projects.api";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserLogged } from "@/app/login/login.api";
import { useEffect, useState } from "react";
import { GeneratePDFProps } from "./GeneratePDF.types";
import { getUseCases } from "../../[projectId]/open/useCases.api";
import { getTestCases } from "../../[projectId]/open/[useCaseId]/testCases.api";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import PDF from "@/components/pdf/pdf";

export interface Project {
  id?: string;
  code?: string;
  image?: string;
  name: string;
  description?: string;
  role?: string;
}
export interface UseCase {
  id?: string;
  code?: string;
  name: string;
  description?: string;
  preconditions?: string;
  postconditions?: string;
  mainFlow?: string;
  alternateFlows?: string;
}
export interface TestCase {
  id?: string;
  code?: string;
  name: string;
  description?: string;
  preconditions?: string;
  postconditions?: string;
  mainFlow?: string;
  alternateFlows?: string;
}

export function GeneratePDF(props: GeneratePDFProps) {
  const { setOpenModalGenerate, projectId } = props;
  const router = useRouter();
  const { data: session } = useSession();
  const [projectData, setProjectData] = useState<Project>();
  const [useCasesData, setUseCasesData] = useState<UseCase[]>();
  const [testCasesData, setTestCasesData] = useState<TestCase[]>();

  useEffect(() => {
    if (projectId) {
      const fetchProject = async () => {
        try {
          const project = await getProjectById(projectId);
          setProjectData(project);
          const useCases = await getUseCases(projectId);
          const testCases = await getTestCases(useCases.id);
        } catch (error) {
          console.error("Error al obtener los datos del proyecto:", error);
        }
      };

      fetchProject();
    }
  }, [projectId]);

  return (
    <div>
      <PDFDownloadLink
        document={
          <PDF
            project={projectData ?? { name: "", description: "", role: "" }}
            useCases={useCasesData ?? []}
            testCases={testCasesData ?? []}
          />
        }
        fileName="reporte_proyecto.pdf"
      >
      </PDFDownloadLink>

      {/* Ajustar el tamaño del visor PDF */}
      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <PDFViewer
          style={{ width: "40vw", height: "40vh", border: "1px solid #ccc" }}
        >
          <PDF
            project={projectData ?? { name: "", description: "", role: "" }}
            useCases={useCasesData ?? []}
            testCases={testCasesData ?? []}
          />
        </PDFViewer>
      </div>
    </div>
  );
}
