"use client";

import { useState, useEffect } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { toast } from "@/hooks/use-toast";
import PDF from "@/components/pdf/pdf";
import { Loader2 } from "lucide-react";
import { GeneratePDFProps } from "./GeneratePDF.types";
import { useProjects } from "@/context/ProjectsContext";
import { UseCaseProvider, useUseCases } from "@/context/UseCaseContext";
import { TestCaseProvider, useTestCases } from "@/context/TestCaseContext";

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
  steps?: string;
  inputData?: string;
  expectedResult?: string;
}

function GeneratePDFContent({
  setOpenModalGenerate,
  projectId,
}: GeneratePDFProps) {
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [useCasesData, setUseCasesData] = useState<UseCase[]>([]);
  const [testCasesData, setTestCasesData] = useState<TestCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getProjectById } = useProjects();
  const { getUseCases } = useUseCases();
  const { getTestCases } = useTestCases();

  useEffect(() => {
    const fetchData = async () => {
      if (projectId) {
        try {
          setIsLoading(true);
          const project = await getProjectById(projectId);
          setProjectData(project);
          const useCases = await getUseCases(projectId);
          setUseCasesData(useCases);
          const testCases = await Promise.all(
            useCases.map((useCase: { id: string }) => getTestCases(useCase.id))
          );
          setTestCasesData(testCases.flat());
        } catch (error) {
          toast({
            title: "Error",
            description: "No se pudieron cargar los datos del proyecto",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="text-center">
        No se pudo cargar la información del proyecto.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <PDFDownloadLink
        document={
          <PDF
            project={projectData}
            useCases={useCasesData}
            testCases={testCasesData}
          />
        }
        fileName={`${projectData.name
          .replace(/\s+/g, "_")
          .toLowerCase()}_report.pdf`}
      >
      </PDFDownloadLink>

      <div className="w-full h-[60vh] border border-gray-300 rounded-md overflow-hidden">
        <PDFViewer width="100%" height="100%">
          <PDF
            project={projectData}
            useCases={useCasesData}
            testCases={testCasesData}
          />
        </PDFViewer>
      </div>
    </div>
  );
}

export function GeneratePDF(props: GeneratePDFProps) {
  const { projectId } = props;

  return (
    <UseCaseProvider projectId={projectId || ""}>
      <TestCaseProvider projectId={projectId || ""} useCaseId={""}>
        <GeneratePDFContent {...props} />
      </TestCaseProvider>
    </UseCaseProvider>
  );
}
