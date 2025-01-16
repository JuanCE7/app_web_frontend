import React from "react";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Image,
} from "@react-pdf/renderer";
import { pdfProps } from "./pdf.types";

const styles = StyleSheet.create({
  table: {
    width: "100%",
    marginTop: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColLabel: {
    width: "30%",
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f0f0f0",
  },
  tableColValue: {
    width: "70%",
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableCell: {
    fontSize: 10,
  },
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 70,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    backgroundColor: "#D3D3D3",
    padding: 5,
    fontSize: 11,
    fontWeight: "bold",
  },
});

const getCurrentDate = () => {
  const date = new Date();
  return date.toLocaleDateString(undefined);
};

const removeHtmlTags = (text: string | undefined): string => {
  if (typeof text !== "string") return "";
  return text
    .replace(/<\/[^>]+>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n\s*\n/g, "\n")
    .trim();
};

const PDF = ({ project, useCases, testCases }: pdfProps) => {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Image src="/encabezado.png" />
          <Text style={styles.title}>Plan de Pruebas</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.table}>
          <Text style={styles.sectionTitle}>INFORMACIÓN GENERAL</Text>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCell}>Tema de Proyecto:</Text>
              </View>
              <View style={styles.tableColValue}>
                <Text style={styles.tableCell}>
                  {removeHtmlTags(project.name)}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCell}>Fecha:</Text>
              </View>
              <View style={styles.tableColValue}>
                <Text style={styles.tableCell}>{getCurrentDate()}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCell}>Descripción:</Text>
              </View>
              <View style={styles.tableColValue}>
                <Text style={styles.tableCell}>
                  {removeHtmlTags(project.description)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          {useCases.length === 0 ? (
            <Text style={styles.sectionTitle}>No hay casos de uso</Text>
          ) : (
            useCases.map((useCase, useCaseIndex) => (
              <View key={useCaseIndex} style={styles.section}>
                <View style={styles.table}>
                  <Text style={styles.sectionTitle}>
                    CASO DE USO - {removeHtmlTags(useCase.code)}
                  </Text>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColLabel}>
                      <Text style={styles.tableCell}>Nombre</Text>
                    </View>
                    <View style={styles.tableColValue}>
                      <Text style={styles.tableCell}>
                        {removeHtmlTags(useCase.name)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColLabel}>
                      <Text style={styles.tableCell}>Descripción</Text>
                    </View>
                    <View style={styles.tableColValue}>
                      <Text style={styles.tableCell}>
                        {removeHtmlTags(useCase.description)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColLabel}>
                      <Text style={styles.tableCell}>Precondiciones</Text>
                    </View>
                    <View style={styles.tableColValue}>
                      <Text style={styles.tableCell}>
                        {removeHtmlTags(useCase.preconditions)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColLabel}>
                      <Text style={styles.tableCell}>Postcondiciones</Text>
                    </View>
                    <View style={styles.tableColValue}>
                      <Text style={styles.tableCell}>
                        {removeHtmlTags(useCase.postconditions)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColLabel}>
                      <Text style={styles.tableCell}>Flujo Principal</Text>
                    </View>
                    <View style={styles.tableColValue}>
                      <Text style={styles.tableCell}>
                        {removeHtmlTags(useCase.mainFlow)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColLabel}>
                      <Text style={styles.tableCell}>Flujos Alternos</Text>
                    </View>
                    <View style={styles.tableColValue}>
                      <Text style={styles.tableCell}>
                        {removeHtmlTags(useCase.alternateFlows)}
                      </Text>
                    </View>
                  </View>
                </View>
                {testCases.filter(
                  (testCase) => testCase.useCaseId === useCase.id
                ).length === 0 ? (
                  <Text style={styles.sectionTitle}>
                    No hay casos de prueba funcionales
                  </Text>
                ) : (
                  <View style={styles.table}>
                    <Text style={styles.sectionTitle}>
                      CASOS DE PRUEBA FUNCIONALES -{" "}
                      {removeHtmlTags(useCase.code)}
                    </Text>
                    <View style={styles.tableRow}>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCell}>ID</Text>
                      </View>
                      <View style={styles.tableColValue}>
                        <Text style={styles.tableCell}>Nombre</Text>
                      </View>
                      <View style={styles.tableColValue}>
                        <Text style={styles.tableCell}>Descripción</Text>
                      </View>
                      <View style={styles.tableColValue}>
                        <Text style={styles.tableCell}>Pasos</Text>
                      </View>
                      <View style={styles.tableColValue}>
                        <Text style={styles.tableCell}>Datos de Entrada</Text>
                      </View>
                      <View style={styles.tableColValue}>
                        <Text style={styles.tableCell}>Resultado Esperado</Text>
                      </View>
                    </View>
                    {testCases
                      .filter((testCase) => testCase.useCaseId === useCase.id)
                      .map((testCase, testCaseIndex) => (
                        <View key={testCaseIndex} style={styles.tableRow}>
                          <View style={styles.tableColLabel}>
                            <Text style={styles.tableCell}>
                              {removeHtmlTags(testCase.code)}
                            </Text>
                          </View>
                          <View style={styles.tableColValue}>
                            <Text style={styles.tableCell}>
                              {removeHtmlTags(testCase.name)}
                            </Text>
                          </View>
                          <View style={styles.tableColValue}>
                            <Text style={styles.tableCell}>
                              {removeHtmlTags(testCase.description)}
                            </Text>
                          </View>
                          <View style={styles.tableColValue}>
                            <Text style={styles.tableCell}>
                              {removeHtmlTags(testCase.steps)}
                            </Text>
                          </View>
                          <View style={styles.tableColValue}>
                            <Text style={styles.tableCell}>
                              {removeHtmlTags(testCase.inputData)}
                            </Text>
                          </View>
                          <View style={styles.tableColValue}>
                            <Text style={styles.tableCell}>
                              {removeHtmlTags(testCase.expectedResult)}
                            </Text>
                          </View>
                        </View>
                      ))}
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </Page>
    </Document>
  );
};

export default PDF;
