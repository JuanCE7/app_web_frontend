import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { pdfProps } from "./pdf.types";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
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
    width: "30%", // Columna para etiquetas
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f0f0f0",
  },
  tableColValue: {
    width: "70%", // Columna para valores
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableHeader: {
    backgroundColor: "#eaeaea",
    fontWeight: "bold",
  },
  tableCell: {
    fontSize: 10,
  },
});

const removeHtmlTags = (text: string | undefined): string => {
  if (typeof text !== "string") return "";

  // Reemplaza las etiquetas HTML por un salto de línea solo entre etiquetas
  return text
    .replace(/<\/[^>]+>/g, "\n") // Reemplaza etiquetas de cierre por saltos de línea
    .replace(/<[^>]+>/g, "") // Elimina las etiquetas de apertura
    .replace(/\n\s*\n/g, "\n") // Elimina saltos de línea repetidos consecutivos
    .trim(); // Elimina espacios o saltos al inicio y final
};


const PDF = ({ project, useCases, testCases }: pdfProps) => {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Plan de Pruebas - Formato IEEE 829</Text>

        {/* Información del Proyecto */}
        <View style={styles.table}>
          <Text style={styles.tableHeader}>Proyecto: {removeHtmlTags(project.name)}</Text>
          <Text style={styles.tableRow}>Descripción: {removeHtmlTags(project.description)}</Text>
        </View>

        {/* Casos de Uso y Casos de Prueba */}
        {useCases.map((useCase, useCaseIndex) => (
          <View key={useCaseIndex} style={styles.section}>
            <Text style={styles.title}>{removeHtmlTags(useCase.name)}</Text>
            {/* Tabla de Información del Caso de Uso */}
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColLabel}>
                  <Text style={styles.tableCell}>Nombre</Text>
                </View>
                <View style={styles.tableColValue}>
                  <Text style={styles.tableCell}>{removeHtmlTags(useCase.name)}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableColLabel}>
                  <Text style={styles.tableCell}>Descripción</Text>
                </View>
                <View style={styles.tableColValue}>
                  <Text style={styles.tableCell}>{removeHtmlTags(useCase.description)}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableColLabel}>
                  <Text style={styles.tableCell}>Precondiciones</Text>
                </View>
                <View style={styles.tableColValue}>
                  <Text style={styles.tableCell}>{removeHtmlTags(useCase.preconditions)}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableColLabel}>
                  <Text style={styles.tableCell}>Postcondiciones</Text>
                </View>
                <View style={styles.tableColValue}>
                  <Text style={styles.tableCell}>{removeHtmlTags(useCase.postconditions)}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableColLabel}>
                  <Text style={styles.tableCell}>Flujo Principal</Text>
                </View>
                <View style={styles.tableColValue}>
                  <Text style={styles.tableCell}>{removeHtmlTags(useCase.mainFlow)}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableColLabel}>
                  <Text style={styles.tableCell}>Flujos Alternos</Text>
                </View>
                <View style={styles.tableColValue}>
                  <Text style={styles.tableCell}>{removeHtmlTags(useCase.alternateFlows)}</Text>
                </View>
              </View>
            </View>

            {/* Tabla de Casos de Prueba relacionados */}
            <Text style={{ marginTop: 10, fontWeight: "bold" }}>Casos de Prueba Relacionados:</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
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
                      <Text style={styles.tableCell}>{removeHtmlTags(testCase.code)}</Text>
                    </View>
                    <View style={styles.tableColValue}>
                      <Text style={styles.tableCell}>{removeHtmlTags(testCase.name)}</Text>
                    </View>
                    <View style={styles.tableColValue}>
                      <Text style={styles.tableCell}>{removeHtmlTags(testCase.description)}</Text>
                    </View>
                    <View style={styles.tableColValue}>
                      <Text style={styles.tableCell}>{removeHtmlTags(testCase.steps)}</Text>
                    </View>
                    <View style={styles.tableColValue}>
                      <Text style={styles.tableCell}>{removeHtmlTags(testCase.inputData)}</Text>
                    </View>
                    <View style={styles.tableColValue}>
                      <Text style={styles.tableCell}>{removeHtmlTags(testCase.expectedResult)}</Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default PDF;
