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
    width: "25%",
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableCell: {
    fontSize: 10,
  },
});

const PDF = ({ project, useCases, testCases }: pdfProps) => {
  return (
    <Document>
      <Page style={styles.page}>
        {/* Título del documento */}
        <Text style={styles.title}>Reporte del Proyecto</Text>

        {/* Información del proyecto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proyecto: {project.name}</Text>
          <Text style={styles.paragraph}>Descripción: {project.description}</Text>
          
        </View>

        {/* Casos de uso */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Casos de Uso</Text>
          {useCases.map((useCase, index) => (
            <View key={index}>
              <Text style={styles.paragraph}>
                {index + 1}. {useCase.name}
              </Text>
              <Text style={styles.paragraph}>
                Objetivos: {useCase.description}
              </Text>
              <Text style={styles.paragraph}>
                Precondiciones: {useCase.preconditions}
              </Text>
              <Text style={styles.paragraph}>
                Postcondiciones: {useCase.postconditions}
              </Text>
              
            </View>
          ))}
        </View>

        {/* Casos de prueba */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Casos de Prueba</Text>
          <View style={styles.table}>
            {/* Encabezados de la tabla */}
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>ID</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Descripción</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Resultado Esperado</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Estado</Text>
              </View>
            </View>
            {/* Filas dinámicas */}
            {testCases.map((testCase, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{testCase.id}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{testCase.description}</Text>
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
