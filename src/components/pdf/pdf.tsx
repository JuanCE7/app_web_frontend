import React from "react";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
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
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 5,
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
  tableCol: {
    width: "16.66%", // Ajustado para 6 columnas
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableCell: {
    fontSize: 10,
  },
});
const removeHtmlTags = (text: string | undefined): string => {
  if (typeof text !== 'string') return '';
  return text.replace(/<[^>]*>/g, '\n');
};

const PDF = ({ project, useCases, testCases }: pdfProps) => {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Reporte del Proyecto</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proyecto: {removeHtmlTags(project.name)}</Text>
          <Text style={styles.paragraph}>Descripción: {removeHtmlTags(project.description)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Casos de Uso</Text>
          {useCases.map((useCase, index) => (
            <View key={index}>
              <Text style={styles.paragraph}>
                {index + 1}. {removeHtmlTags(useCase.name)}
              </Text>
              <Text style={styles.paragraph}>
                Descripción: {removeHtmlTags(useCase.description)}
              </Text>
              <Text style={styles.paragraph}>
                Precondiciones: {removeHtmlTags(useCase.preconditions)}
              </Text>
              <Text style={styles.paragraph}>
                Postcondiciones: {removeHtmlTags(useCase.postconditions)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Casos de Prueba</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>ID</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Nombre</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Descripción</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Pasos</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Datos de Entrada</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Resultado Esperado</Text>
              </View>
            </View>
            {testCases.map((testCase, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{removeHtmlTags(testCase.code)}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{removeHtmlTags(testCase.name)}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{removeHtmlTags(testCase.description)}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{removeHtmlTags(testCase.steps)}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{removeHtmlTags(testCase.inputData)}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{removeHtmlTags(testCase.expectedResult)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PDF;