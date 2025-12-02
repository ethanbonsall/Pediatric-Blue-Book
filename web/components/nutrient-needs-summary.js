// File: web/components/nutrient-needs-summary.js
// PDF document component for generating printable nutrient needs calculation summaries.
// Displays calculated nutrient requirements in a formatted PDF document.

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 22,
    marginBottom: 10,
    color: "#13294B",
    fontWeight: "bold",
  },
  subheader: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 15,
    color: "#4F758B",
  },
  table: {
    width: "75%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    minHeight: 35,
    alignItems: "center",
  },
  tableRowEven: {
    backgroundColor: "#f8fafc",
  },
  tableRowOdd: {
    backgroundColor: "#FFFFFF",
  },
  tableCol: {
    width: "50%",
    padding: 10,
  },
  tableCellLabel: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "bold",
  },
  tableCellValue: {
    fontSize: 11,
    color: "#1e293b",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#13294B",
    borderBottomWidth: 2,
    borderBottomColor: "#13294B",
    minHeight: 40,
    alignItems: "center",
  },
  tableHeaderCol: {
    width: "50%",
    padding: 10,
  },
  tableHeaderText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  text: {
    fontSize: 11,
    color: "#1e293b",
    marginBottom: 8,
    lineHeight: 1.5,
  },
});

const TableRow = ({ label, value, isEven }) => (
  <View
    style={[styles.tableRow, isEven ? styles.tableRowEven : styles.tableRowOdd]}
    wrap={false}
  >
    <View style={styles.tableCol}>
      <Text style={styles.tableCellLabel}>{label}</Text>
    </View>
    <View style={styles.tableCol}>
      <Text style={styles.tableCellValue}>{value}</Text>
    </View>
  </View>
);

// Create Document Component
const MyDocument = ({ nutrients, ideal50, ideal25, catchUp }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {}
        <Text style={styles.header}>Nutritional Needs Summary</Text>
        <Text style={styles.subheader}>Daily Estimated Nutritional Needs</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableHeaderCol}>
              <Text style={styles.tableHeaderText}>Nutrient</Text>
            </View>
            <View style={styles.tableHeaderCol}>
              <Text style={styles.tableHeaderText}>Amount</Text>
            </View>
          </View>
          {nutrients
            .filter((n) => n.name && n.name.trim() !== "")
            .map((nutrient, index) => (
              <TableRow
                key={index}
                label={nutrient.name}
                value={nutrient.amount.replace(/≥/g, "")}
                isEven={index % 2 === 0}
              />
            ))}
        </View>
        <Text style={styles.subheader}>Ideal Body Weight</Text>
        <Text style={styles.text}>
          BMI (50th Percentile for age): {ideal50} kg (
          {Math.round((ideal50 * 2.205 * 10) / 10)} lb)
        </Text>
        <Text style={styles.text}>
          BMI (25th Percentile for age): {ideal25} kg (
          {Math.round((ideal25 * 2.205 * 10) / 10)} lb)
        </Text>
        <Text style={styles.text}>Catch Up Energy: {catchUp} cal </Text>
      </Page>
    </Document>
  );
};

export default MyDocument;
