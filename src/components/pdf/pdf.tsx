import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { pdfProps } from "./pdf.types";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  section: {
    marginBottom: 10,
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
  },
  tableCell: {
    margin: 5,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
});

const removeHtmlTags = (text: string | undefined): string => {
  if (typeof text !== "string") return "";
  return text.replace(/<[^>]*>/g, " ").trim();
};

const TableRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.tableRow}>
    <View style={[styles.tableCol, { width: "30%" }]}>
      <Text style={styles.tableCell}>{label}</Text>
    </View>
    <View style={[styles.tableCol, { width: "70%" }]}>
      <Text style={styles.tableCell}>{removeHtmlTags(value)}</Text>
    </View>
  </View>
);

const PDF = ({ project, useCases, testCases }: pdfProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Plan de Pruebas - Formato IEEE 829</Text>

        <View style={styles.section}>
          <Text style={styles.title}>Proyecto: {removeHtmlTags(project.name)}</Text>
          <Text>Descripción: {removeHtmlTags(project.description)}</Text>
        </View>

        {useCases.map((useCase, useCaseIndex) => (
          <View key={useCaseIndex} style={styles.section}>
            <Text style={styles.title}>{removeHtmlTags(useCase.name)}</Text>
            
            <View style={styles.table}>
              <TableRow label="Nombre" value={useCase.name} />
              <TableRow label="Descripción" value={useCase.description || ""} />
              <TableRow label="Precondiciones" value={useCase.preconditions || ""} />
              <TableRow label="Postcondiciones" value={useCase.postconditions || ""} />
              <TableRow label="Flujo Principal" value={useCase.mainFlow || ""} />
              <TableRow label="Flujos Alternos" value={useCase.alternateFlows || ""} />
            </View>

            <Text style={styles.title}>Casos de Prueba Relacionados:</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[styles.tableCol, { width: "20%" }]}><Text style={styles.tableCell}>ID</Text></View>
                <View style={[styles.tableCol, { width: "80%" }]}><Text style={styles.tableCell}>Nombre</Text></View>
              </View>
              {testCases
                .filter((testCase) => testCase.useCaseId === useCase.id)
                .map((testCase, testCaseIndex) => (
                  <View key={testCaseIndex} style={styles.tableRow}>
                    <View style={[styles.tableCol, { width: "20%" }]}>
                      <Text style={styles.tableCell}>{removeHtmlTags(testCase.code)}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "80%" }]}>
                      <Text style={styles.tableCell}>{removeHtmlTags(testCase.name)}</Text>
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

