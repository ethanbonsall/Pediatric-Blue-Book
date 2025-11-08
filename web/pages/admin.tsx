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
import { Check, Pencil, Plus, ShieldCheck, ShieldMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { LiquidProductRow, PowderProductRow } from "@/lib/types";

const AdminTable = () => {
  // New products with default fields for adding a new product feature

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
  // const [fieldValue, setFieldValue] = useState("");
  const [isSuperUser, setIsSuperUser] = useState(true);
  const [newProduct, setNewProduct] = useState<
    Partial<LiquidProductRow | PowderProductRow>
  >({});

  // const [modifiedProduct, setModifiedProduct] = useState<
  //   LiquidProductRow | PowderProductRow | null
  // >(null);
  // const [isDataAdmin, setIsDataAdmin] = useState(false);
  const [products, setProducts] = useState<
    LiquidProductRow[] | PowderProductRow[] | []
  >([]);
  type ColumnKeys = keyof LiquidProductRow | keyof PowderProductRow;

  const textOnlyFields = [
    "product",
    "company_brand",
    "age",
    "protein_sources",
    "carbohydrate_sources",
    "fat_sources",
    "specialty_ingredients",
    "prebiotic_sources",
    "probiotic_sources",
    "notes",
    "probiotic",
    "allergens",
    "np100_standard_volume",
  ];

  const calculatedFields = [
    "np100_percent_cal_from_protein",
    "np100_percent_cal_from_cho",
    "np100_percent_cal_from_fat",
    "np100_percent_free_water",
    "npc_percent_free_water",
    "npc_percent_cal_from_protein",
    "npc_percent_cal_from_cho",
    "npc_percent_cal_from_fat",
  ];

  // Checking User permissions - FIXME
  // async function getUserRole() {
  //   const {
  //     data: { user },
  //   } = await supabase.auth.getUser();
  //   if (user) {
  //     const { data } = await supabase
  //       .from("users")
  //       .select("role")
  //       .eq("id", user.id)
  //       .single();

  //     if (data!.role == "superuser") {
  //       setIsSuperUser(true);
  //     }
  //     if (data!.role == "admin") {
  //       setIsDataAdmin(true);
  //     }
  //   }
  // }

  // Retrieve formula data + fields, set calculated fields
  const getFormulas = async (ingredientType: string) => {
    setProductType(ingredientType);
    console.log(productType);

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

      // calculated fields for Liquid Products
      for (const liquidProduct of liquidRows) {
        liquidProduct.npc_percent_free_water = parseFloat(
          (
            liquidProduct.water_ml! / liquidProduct.amount_per_carton_ml!
          ).toFixed(4)
        );
        liquidProduct.npc_percent_cal_from_protein = parseFloat(
          (
            (liquidProduct.total_protein_g! * 4) /
            (liquidProduct.amount_per_carton_ml! *
              liquidProduct.calories_per_ml!)
          ).toFixed(4)
        );
        liquidProduct.npc_percent_cal_from_cho = parseFloat(
          (
            (liquidProduct.total_carbohydrate_g! * 4) /
            (liquidProduct.amount_per_carton_ml! *
              liquidProduct.calories_per_ml!)
          ).toFixed(4)
        );
        liquidProduct.npc_percent_cal_from_fat = parseFloat(
          (
            (liquidProduct.total_fat_g! * 9) /
            (liquidProduct.amount_per_carton_ml! *
              liquidProduct.calories_per_ml!)
          ).toFixed(4)
        );
      }
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

      // calculated fields for Powder
      for (const powderProduct of powderRows) {
        powderProduct.np100_percent_cal_from_protein = parseFloat(
          (
            (powderProduct.np100_total_protein_g! * 4) /
            (powderProduct.calories_per_gram! * 100)
          ).toFixed(4)
        );
        powderProduct.np100_percent_cal_from_cho = parseFloat(
          (
            (powderProduct.np100_total_carbohydrate_g! * 4) /
            (powderProduct.calories_per_gram! * 100)
          ).toFixed(4)
        );
        powderProduct.np100_percent_cal_from_fat = parseFloat(
          (
            (powderProduct.np100_total_fat_g! * 4) /
            (powderProduct.calories_per_gram! * 100)
          ).toFixed(4)
        );
      }

      setProducts(powderRows);
      setColumns(powderColumns);
    }
  };

  // Retrieve powdered formulas + fields

  const filteredProducts = products.filter((product) => {
    if (filterBy === "Approved") return product.approved === true;
    if (filterBy === "Not Approved") return product.approved === false;
    if (filterBy === "Active") return product.active === true;
    if (filterBy === "Inactive") return product.active === false;
    return true;
  });

  // Handle field value change with validation and update new product
  const handleFieldValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    column: string,
    is_text: boolean
  ) => {
    let value = e.target.value;

    if (is_text) {
      // Allow only letters, spaces, and common punctuation for text fields
      const textValue = value.replace(/[^a-zA-Z\s.,'-]/g, "");
      value = textValue;
    } else {
      // Allow only numbers and decimal point for numeric fields
      const numericValue = value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*?)\..*/g, "$1");
      value = numericValue;
    }

    setNewProduct((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  // Adding new product to database

  const insertNewProduct = async (isLiquid: boolean) => {
    let table = "";
    if (isLiquid) {
      table = "liquid_ingredients";
    } else {
      table = "powder_ingredients";
    }
    setNewProduct((prev) => ({
      ...prev,
      approved: false,
      active: false,
    }));

    const { error } = await supabase.from(table).insert(newProduct);
    if (error) {
      console.log("Error inserting row: ", error.message);
    } else {
      alert("Changes saved!");
    }
  };

  useEffect(() => {
    getFormulas("Liquid"); // Load liquid table by default
    setIsSuperUser(true); // FIXME
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
                <SelectValue defaultValue="All" placeholder="All" />
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
                          // setFieldValue("");
                        }}
                        className="text-gray-600 hover:text-gray-900 ml-2"
                      >
                        <span className="text-xl">
                          <Pencil />
                        </span>
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
                // setFieldValue("");
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
          <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative overflow-y-auto max-h-[80%]">
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
              Make changes to the product data.
            </p>

            {/* Form Fields */}

            {columns
              .slice(1)
              .filter((column) => column != "active" && column != "approved")
              .map((column) => (
                <div key={column}>
                  <label className="block text-sm font-medium mt-2 mb-1">
                    {column}
                  </label>
                  <input
                    type={textOnlyFields.includes(column) ? "text" : "number"}
                    value={
                      (newProduct[
                        column as keyof typeof newProduct
                      ] as string) || ""
                    }
                    onChange={(e) =>
                      handleFieldValueChange(
                        e,
                        column,
                        textOnlyFields.includes(column)
                      )
                    }
                    placeholder={
                      textOnlyFields.includes(column)
                        ? "Enter new value"
                        : "Enter new value"
                    }
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative overflow-y-auto max-h-[80%]">
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
            <p className="text-sm text-gray-600 mb-6">Create new product.</p>

            {/* Form Fields */}
            {columns
              .filter(
                (column) =>
                  column != "active" &&
                  column != "approved" &&
                  !calculatedFields.includes(column)
              )
              .map((column) => (
                <div key={column}>
                  <label className="block text-sm font-medium mt-2 mb-1">
                    {column}
                  </label>
                  <input
                    type={textOnlyFields.includes(column) ? "text" : "number"}
                    value={
                      (newProduct[
                        column as keyof typeof newProduct
                      ] as string) || ""
                    }
                    onChange={(e) =>
                      handleFieldValueChange(
                        e,
                        column,
                        textOnlyFields.includes(column)
                      )
                    }
                    placeholder={
                      textOnlyFields.includes(column)
                        ? "Enter text"
                        : "Enter number"
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              ))}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setNewProduct({});
                  setIsAddModalOpen(false);
                }}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  insertNewProduct(productType == "Liquid");
                  setNewProduct({});
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
