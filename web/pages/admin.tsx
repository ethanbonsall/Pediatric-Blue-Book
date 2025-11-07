import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import Navbar from "@/components/navbar-profile";
import Head from "next/head";
import { Check, Plus, Power, ShieldCheck, ShieldMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { LiquidProductRow, PowderProductRow } from "@/lib/types";

// Add type definition for Product
interface LiquidProduct {
  id?: number;
  Product: string;
  "Company/Brand": string;
  Age: string;
  "Protein Sources": string;
  Approved: string;
  Active: string;
}

interface PowderedProduct {
  id?: number;
  Product: string;
  "Company/Brand": string;
  Age: string;
  "Protein Sources": string;
  Approved: string;
  Active: string;
}
interface Field {
  id?: number;
  field: string;
}

const AdminTable = () => {
  const [filterBy, setFilterBy] = useState("Approved");
  const [columns, setColumns] = useState<
    (keyof LiquidProductRow | keyof PowderProductRow)[]
  >([]);
  const [productType, setProductType] = useState("Liquid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<
    LiquidProductRow | PowderProductRow | null
  >(null);
  const [selectedField, setSelectedField] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [isSuperUser, setIsSuperUser] = useState(true);
  const [products, setProducts] = useState<
    LiquidProductRow[] | PowderProductRow[] | []
  >([]);
  type ColumnKeys = keyof LiquidProductRow | keyof PowderProductRow;

  // Checking User permissions - FIXME
  if (1 + 1 == 3) {
    setIsSuperUser(false);
  }

  // Retrieve liquid formulas + fields

  const getFormulas = async (ingredientType: string) => {
    setProductType(ingredientType);

    if (ingredientType == "Liquid") {
      const { data: liquidForm, error: liquidFormError } = await supabase
        .from("liquid_ingredients")
        .select("*");

      if (liquidFormError) {
        console.log("Error retrieving liquid formulas: ", liquidFormError);
      }

      const liquidRows = (liquidForm ?? []) as LiquidProductRow[];
      const liquidColumns =
        liquidRows.length > 0
          ? (Object.keys(liquidRows[0]).filter(
              (key) => key != "id"
            ) as ColumnKeys[])
          : [];
      setProducts(liquidRows);
      setColumns(liquidColumns);
    } else {
      const { data: powderForm, error: powderFormError } = await supabase
        .from("powder_ingredients")
        .select("*");

      if (powderFormError) {
        console.log("Error retrieving powder formulas: ", powderFormError);
      }

      const powderRows = (powderForm ?? []) as PowderProductRow[];
      const powderColumns =
        powderRows.length > 0
          ? (Object.keys(powderRows[0]).filter(
              (key) => key != "id"
            ) as ColumnKeys[])
          : [];
      console.log(powderRows);
      setProducts(powderRows);
      setColumns(powderColumns);
    }
  };

  // Retrieve powdered formulas + fields

  // Sample data for demonstration
  const sampleProducts: LiquidProduct[] = [
    {
      id: 1,
      Product: "EleCare (for Infants)",
      "Company/Brand": "Abbott",
      Age: "0-12 months",
      "Protein Sources": "Amino Acids",
      Approved: "Y",
      Active: "Y",
    },
    {
      id: 2,
      Product: "Beneprotein",
      "Company/Brand": "Nutricia",
      Age: "all",
      "Protein Sources": "Whey protein isolate",
      Approved: "Y",
      Active: "N",
    },
    {
      id: 3,
      Product: "Product3",
      "Company/Brand": "Company C",
      Age: "4",
      "Protein Sources": "Soy",
      Approved: "N",
      Active: "N",
    },
    {
      id: 4,
      Product: "Product4",
      "Company/Brand": "Company D",
      Age: "5",
      "Protein Sources": "Casein",
      Approved: "Y",
      Active: "Y",
    },
  ];

  const fields: Field[] = [
    { id: 1, field: "Age" },
    { id: 2, field: "Protein Sources" },
    { id: 3, field: "Carbohydrate Sources" },
    { id: 4, field: "Fiber Sources" },
  ];

  const filteredProducts = products.filter((product) => {
    if (filterBy === "Approved") return product.approved === true;
    if (filterBy === "Not Approved") return product.approved === false;
    if (filterBy === "Active") return product.active === true;
    if (filterBy === "Inactive") return product.active === false;
    return true;
  });

  // Text-only fields
  const textOnlyFields = ["Company/Brand", "Notes"];

  // Handle field value change with validation
  const handleFieldValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (textOnlyFields.includes(selectedField)) {
      // Allow only letters, spaces, and common punctuation for text fields
      const textValue = value.replace(/[^a-zA-Z\s.,'-]/g, "");
      setFieldValue(textValue);
    } else {
      // Allow only numbers and decimal point for numeric fields
      const numericValue = value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*?)\..*/g, "$1");
      setFieldValue(numericValue);
    }
  };

  useEffect(() => {
    getFormulas("Liquid"); // Load liquid table by default
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen rounded-t-[20px] pb-8">
      <Head>
        <title>Formula Table</title>
      </Head>
      <Navbar />
      <p className="text-3xl lg:text-5xl 2xl:text-6xl font-semibold text-black w-fit rounded-[20px] p-2 mt-4 ml-[2dvw] mb-[2dvh]">
        Admin Panel
      </p>

      {/* Main Content */}
      <div className="px-[5%]">
        {/* Filters */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <span className="font-semibold">Filter By:</span>
            <Select onValueChange={(value) => setFilterBy(value)}>
              <SelectTrigger className="w-40 bg-white rounded-xl text-text">
                <SelectValue defaultValue="Approved" placeholder="Approved" />
              </SelectTrigger>
              <SelectContent className="bg-white w-fit rounded">
                <SelectGroup className="bg-white">
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="Approved"
                  >
                    Approved
                  </SelectItem>
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="Not Approved"
                  >
                    Not Approved
                  </SelectItem>
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="Active"
                  >
                    Active
                  </SelectItem>
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="Inactive"
                  >
                    Inactive
                  </SelectItem>
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="All"
                  >
                    All
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold">Ingredient Type: </span>
            <Select onValueChange={(value) => getFormulas(value)}>
              <SelectTrigger className="w-40 bg-white rounded-xl text-text">
                <SelectValue defaultValue="Liquid" placeholder="Liquid" />
              </SelectTrigger>
              <SelectContent className="bg-white w-fit rounded">
                <SelectGroup className="bg-white">
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="Liquid"
                  >
                    Liquid
                  </SelectItem>
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="Powdered"
                  >
                    Powdered
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-full max-w-full mb-4 mt-4 flex justify-between items-end">
          {isSuperUser ? (
            <div className="flex gap-[10%] ">
              <Button
                variant="default"
                className="rounded-full bg-green-600"
                size="sm"
              >
                <ShieldCheck /> Activate
              </Button>
              <Button
                variant="default"
                className="rounded-full bg-red-600"
                size="sm"
              >
                <ShieldMinus /> Deactivate
              </Button>
            </div>
          ) : (
            <></>
          )}
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b-2 bg-gray-50">
              <tr className="text-left">
                {columns!.map((column) => (
                  <th key={column} className="py-2 px-2 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts?.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">
                    <div className="flex items-center justify-between">
                      <span>{product.product || ""}</span>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsEditModalOpen(true);
                          setSelectedField("");
                          setFieldValue("");
                        }}
                        className="text-gray-600 hover:text-gray-900 ml-2"
                      >
                        <span className="text-xl">⋯</span>
                      </button>
                    </div>
                  </td>
                  {columns?.slice(1).map((column) => (
                    <td key={String(column)} className="py-2 px-2">
                      {String(product[column as keyof typeof product] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          {isSuperUser ? (
            <div>
              <Button variant="default" className="rounded-full" size="sm">
                <Check /> Approve
              </Button>
            </div>
          ) : (
            <></>
          )}
          <div>
            <Button
              onClick={() => {
                setSelectedProduct(null);
                setIsAddModalOpen(true);
                setSelectedField("");
                setFieldValue("");
              }}
              variant="default"
              className="rounded-full"
              size="sm"
            >
              <Plus /> Add Entry
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-2">
              {selectedProduct?.product || "Product"} Information
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Make changes to the product data
            </p>

            {/* Form Fields */}

            {fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium mt-2 mb-1">
                  {field.field}
                </label>
                <input
                  type="text"
                  value={fieldValue}
                  onChange={handleFieldValueChange}
                  placeholder={
                    textOnlyFields.includes(selectedField)
                      ? "Enter new value"
                      : "Enter new value"
                  }
                  disabled={!selectedField}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Changes saved! (Demo only)");
                  setIsEditModalOpen(false);
                }}
                className="flex-1 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-2">
              {selectedProduct?.product || "Product"} Information
            </h2>
            <p className="text-sm text-gray-600 mb-6">Create new product</p>

            {/* Form Fields */}
            {fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium mt-2 mb-1">
                  {field.field}
                </label>
                <input
                  type="text"
                  value={fieldValue}
                  onChange={handleFieldValueChange}
                  placeholder={
                    textOnlyFields.includes(selectedField)
                      ? "Enter value"
                      : "Enter value"
                  }
                  disabled={!selectedField}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Changes saved! (Demo only)");
                  setIsAddModalOpen(false);
                }}
                className="flex-1 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTable;
