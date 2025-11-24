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

// Three-column row for Calculated Nutrients table
const TableRowThree = ({ label, value, dri, isEven }) => (
  <View
    style={[styles.tableRow, isEven ? styles.tableRowEven : styles.tableRowOdd]}
    wrap={false}
  >
    <View style={{ width: "50%", padding: 10 }}>
      <Text style={styles.tableCellLabel}>{label}</Text>
    </View>
    <View style={{ width: "30%", padding: 10 }}>
      <Text style={styles.tableCellValue}>{value}</Text>
    </View>
    <View style={{ width: "20%", padding: 10 }}>
      <Text style={styles.tableCellValue}>{dri}</Text>
    </View>
  </View>
);

// Create Document Component

const FormulaDocument = ({ selectedIngredients = [], servings = 1, calculatedNutrients, totalVolume}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Formula Summary</Text>
        <Text>Produces {servings} servings</Text>
        <Text style={styles.subheader}>Formula Mix</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableHeaderCol}>
              <Text style={styles.tableHeaderText}>Ingredient</Text>
            </View>
            <View style={styles.tableHeaderCol}>
              <Text style={styles.tableHeaderText}>Amount</Text>
            </View>
          </View>
          {selectedIngredients && selectedIngredients.length > 0 &&
            selectedIngredients
              .filter((n) => n.name && n.name.trim() !== "")
              .map((ing, index) => (
                <TableRow key={index} label={ing.name} value={ing.amount || ""} isEven={index % 2 === 0} />
                
              ))}
        </View>

        <Text style={styles.subheader}>Calculated Nutrients</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={{ width: "50%", padding: 10 }}>
              <Text style={styles.tableHeaderText}>Nutrient</Text>
            </View>
            <View style={{ width: "30%", padding: 10 }}>
              <Text style={styles.tableHeaderText}>Amount</Text>
            </View>
            <View style={{ width: "20%", padding: 10 }}>
                <Text style={styles.tableHeaderText}>DRI</Text>
            </View>
          </View>
          {calculatedNutrients && calculatedNutrients.length > 0 &&
            calculatedNutrients
              .filter((n) => n.name && n.name.trim() !== "")
              .map((n, index) => (
                <TableRowThree
                  key={index}
                  label={n.name}
                  value={(n.formattedAmount || n.amount || "").toString().replace(/≥/g, "")}
                  dri={n.formattedIdeal || ""}
                  isEven={index % 2 === 0}
                />
              ))}

        </View>

            <Text style={styles.text}>Servings (per day): {servings}</Text>
            <Text style={styles.text}>Total Prepared Volume: {totalVolume} mL</Text>
      </Page>
    </Document>
  );
};

export default FormulaDocument;
