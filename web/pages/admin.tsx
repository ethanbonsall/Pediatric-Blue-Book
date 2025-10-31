import { useState } from "react";
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
import { Check, Plus, ShieldCheck, ShieldMinus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Add type definition for Product
interface Product {
  id?: number;
  Product: string;
  "Company/Brand": string;
  Age: string;
  "Protein Sources": string;
  Approved: string;
  Active: string;
}

const AdminTable = () => {
  const [filterBy, setFilterBy] = useState("Approved");
  const [columns, setColumns] = useState("Nutrient");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedField, setSelectedField] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [isSuperUser, setIsSuperUser] = useState(true);

  // Sample data for demonstration
  const sampleProducts: Product[] = [
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

  const filteredProducts = sampleProducts.filter((product) => {
    if (filterBy === "Approved") return product.Approved === "Y";
    if (filterBy === "Not Approved") return product.Approved === "N";
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

  return (
    <div className="flex flex-col bg-gradient-to-tr from-primary-500 to-primary-700 w-full min-h-screen rounded-t-[20px] pb-8">
      <Head>
        <title>Formula Table</title>
      </Head>
      <Navbar />
      <p className="text-3xl lg:text-5xl 2xl:text-6xl font-semibold text-white w-fit rounded-[20px] p-2 mt-4 ml-[2dvw] mb-[2dvh]">
        Admin Panel
      </p>

      {/* Main Content */}
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
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
                      value="All"
                    >
                      All
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-semibold">
                Columns: {columns ? "" : ""}
              </span>
              <Select onValueChange={(value) => setColumns(value)}>
                <SelectTrigger className="w-40 bg-white rounded-xl text-text">
                  <SelectValue defaultValue="Nutrient" placeholder="Nutrient" />
                </SelectTrigger>
                <SelectContent className="bg-white w-fit rounded">
                  <SelectGroup className="bg-white">
                    <SelectItem
                      className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                      value="Nutrient"
                    >
                      Nutrient
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
          </div>

          <div className="w-full max-w-full mb-4 mt-4 flex justify-between items-end">
            {isSuperUser ? (
              <div className="flex gap-[10%]">
                <Button variant="default" className="rounded-full" size="sm">
                  <ShieldCheck /> Activate
                </Button>
                <Button variant="default" className="rounded-full" size="sm">
                  <ShieldMinus /> Deactivate
                </Button>
              </div>
            ) : (
              <></>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b-2 bg-gray-50">
                <tr className="text-left">
                  <th className="py-2 px-2 font-semibold">Product</th>
                  <th className="py-2 px-2 font-semibold">Company/Brand</th>
                  <th className="py-2 px-2 font-semibold">Age</th>
                  <th className="py-2 px-2 font-semibold">Protein Sources</th>
                  <th className="py-2 px-2 font-semibold">Carb Sources</th>
                  <th className="py-2 px-2 font-semibold">Fiber Sources</th>
                  <th className="py-2 px-2 font-semibold">Fat Sources</th>
                  <th className="py-2 px-2 font-semibold">
                    Specialty Ingredients
                  </th>
                  <th className="py-2 px-2 font-semibold">g/scoop</th>
                  <th className="py-2 px-2 font-semibold">g/tsp</th>
                  <th className="py-2 px-2 font-semibold">Cal/g</th>
                  <th className="py-2 px-2 font-semibold">Protein g</th>
                  <th className="py-2 px-2 font-semibold">Fat g</th>
                  <th className="py-2 px-2 font-semibold">Notes</th>
                  <th className="py-2 px-2 font-semibold">Approved</th>
                  <th className="py-2 px-2 font-semibold">Active</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr
                    key={product.id || index}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-2 px-2">
                      <div className="flex items-center justify-between">
                        <span>{product.Product || ""}</span>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsModalOpen(true);
                            setSelectedField("");
                            setFieldValue("");
                          }}
                          className="text-gray-600 hover:text-gray-900 ml-2"
                        >
                          <span className="text-xl">⋯</span>
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      {product["Company/Brand"] || ""}
                    </td>
                    <td className="py-2 px-2">{product.Age || ""}</td>
                    <td className="py-2 px-2">
                      {product["Protein Sources"] || ""}
                    </td>
                    <td className="py-2 px-2">-</td>
                    <td className="py-2 px-2">-</td>
                    <td className="py-2 px-2">-</td>
                    <td className="py-2 px-2">-</td>
                    <td className="py-2 px-2">-</td>
                    <td className="py-2 px-2">-</td>
                    <td className="py-2 px-2">-</td>
                    <td className="py-2 px-2">-</td>
                    <td className="py-2 px-2">-</td>
                    <td className="py-2 px-2">-</td>
                    <td className="py-2 px-2">{product.Approved || ""}</td>
                    <td className="py-2 px-2">{product.Active || ""}</td>
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
                  setSelectedProduct({
                    Product: "New Product",
                    "Company/Brand": "",
                    Age: "",
                    "Protein Sources": "",
                    Approved: "N",
                    Active: "N",
                  });
                  setIsModalOpen(true);
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
      </div>

      {/* Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-2">
              {selectedProduct?.Product || "Product"} Information
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Make changes to the product data
            </p>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Age Field - Always visible, numeric only */}
              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <input
                  type="text"
                  defaultValue={selectedProduct?.Age || ""}
                  placeholder="Enter age"
                  onChange={(e) => {
                    const numericValue = e.target.value
                      .replace(/[^0-9.]/g, "")
                      .replace(/(\..*?)\..*/g, "$1");
                    e.target.value = numericValue;
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Field Selector Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Field
                </label>
                <select
                  value={selectedField}
                  onChange={(e) => {
                    setSelectedField(e.target.value);
                    setFieldValue("");
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a field...</option>
                  <option value="Company/Brand">Company/Brand (text)</option>
                  <option value="Protein Sources">
                    Protein Sources (numeric)
                  </option>
                  <option value="Carbohydrate Sources">
                    Carbohydrate Sources (numeric)
                  </option>
                  <option value="Fiber Sources">Fiber Sources (numeric)</option>
                  <option value="Fat Sources">Fat Sources (numeric)</option>
                  <option value="Specialty Ingredients">
                    Specialty Ingredients (numeric)
                  </option>
                  <option value="Grams per Scoop">
                    Grams per Scoop (numeric)
                  </option>
                  <option value="Grams per teaspoon">
                    Grams per teaspoon (numeric)
                  </option>
                  <option value="Calories per Gram">
                    Calories per Gram (numeric)
                  </option>
                  <option value="Total Protein g">
                    Total Protein (g) (numeric)
                  </option>
                  <option value="Total Fat g">Total Fat (g) (numeric)</option>
                  <option value="VitaminA mcg RE">
                    Vitamin A (mcg RE) (numeric)
                  </option>
                  <option value="Calcium mg">Calcium (mg) (numeric)</option>
                  <option value="Iron mg">Iron (mg) (numeric)</option>
                  <option value="Notes">Notes (text)</option>
                </select>
              </div>

              {/* Value Input - Changes based on selected field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Enter Value{" "}
                  {selectedField &&
                    `(${
                      textOnlyFields.includes(selectedField)
                        ? "text only"
                        : "numeric only"
                    })`}
                </label>
                <input
                  type="text"
                  value={fieldValue}
                  onChange={handleFieldValueChange}
                  placeholder={
                    textOnlyFields.includes(selectedField)
                      ? "Enter text"
                      : "Enter number"
                  }
                  disabled={!selectedField}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Changes saved! (Demo only)");
                  setIsModalOpen(false);
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
