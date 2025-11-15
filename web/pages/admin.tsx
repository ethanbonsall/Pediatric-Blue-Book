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
import router from "next/router";

const AdminTable = () => {
  const [filterBy, setFilterBy] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [columns, setColumns] = useState<
    (keyof LiquidProductRow | keyof PowderProductRow)[]
  >([]);
  const [productType, setProductType] = useState("Liquid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    LiquidProductRow | PowderProductRow | null
  >(null);

  const [editedFields, setEditedFields] = useState<
    Partial<LiquidProductRow | PowderProductRow>
  >({ approved: false, active: false });
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [newProduct, setNewProduct] = useState<
    Partial<LiquidProductRow | PowderProductRow>
  >({});

  // const [isDataAdmin, setIsDataAdmin] = useState(false);
  const [products, setProducts] = useState<
    LiquidProductRow[] | PowderProductRow[] | []
  >([]);
  const [sortOrder, setSortOrder] = useState("none");
  type ColumnKeys = keyof LiquidProductRow | keyof PowderProductRow;
  const [actionMode, setActionMode] = useState("default"); // modes: approve, activate, deactivate, and default
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  ); // keep track of products that are selected to be approved/activated/etc.

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
  useEffect(() => {
    const GetUserRole = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        if (user) {
          const { data, error } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single();

          if (error) {
            console.error("Error fetching user role: ", error);
            router.push("/login");
            return;
          }
          if (data?.role === "superuser") {
            setIsSuperUser(true);
          }
          if (data!.role !== "superuser" && data!.role !== "admin") {
            router.push("/");
            return;
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    GetUserRole();
  }, []);

  // Retrieve formula data + fields, set calculated fields
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
      } else {
        console.log("Powder products!: ", powderForm.length);
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

  // Sort by product name
  const sortedProducts =
    sortOrder === "none"
      ? filteredProducts
      : [...filteredProducts].sort((a, b) => {
          const aName = String(a.product ?? "").toLowerCase();
          const bName = String(b.product ?? "").toLowerCase();
          if (aName < bName) return sortOrder === "az" ? -1 : 1;
          if (aName > bName) return sortOrder === "az" ? 1 : -1;
          return 0;
        });

  // Handle field value change with validation and update new product for Add Product functionality

  const handleAddEntryFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    column: string,
    is_text: boolean
  ) => {
    let value = e.target.value;

    if (is_text) {
      // Allow only letters, spaces, and common punctuation for text fields
      // const textValue = value.replace(/[^a-zA-Z\s.,'-]/g, "");
      value = value;
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
      approved: false,
      active: false,
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

    const { error } = await supabase.from(table).insert(newProduct);
    if (error) {
      console.log("Error inserting row: ", error.message);
    } else {
      alert("Changes saved!");
    }
  };

  // Handle field value change with validation and update list of edits for Edit Product functionality
  const handleEditEntryFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    column: string,
    is_text: boolean
  ) => {
    let value = e.target.value;

    if (is_text) {
      // Allow only letters, spaces, and common punctuation for text fields
      // const textValue = value.replace(/[^a-zA-Z\s.,'-]/g, "");
      value = value;
    } else {
      // Allow only numbers and decimal point for numeric fields
      const numericValue = value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*?)\..*/g, "$1");
      value = numericValue;
    }

    // Keep track of edited fields
    setEditedFields((prev) => {
      const newFields = { ...prev };

      // Checks if user deleted entry from field --> shouldn't update field in this case
      if (
        value === "" &&
        selectedProduct![column as keyof typeof selectedProduct] !== ""
      ) {
        delete newFields[column as keyof typeof selectedProduct];
        return newFields;
      }

      return { ...newFields, [column]: value };
    });
  };

  const editProduct = async (isLiquid: boolean) => {
    let table = "";
    if (isLiquid) {
      table = "liquid_ingredients";
    } else {
      table = "powder_ingredients";
    }

    // If no fields edited
    if (Object.keys(editedFields).length == 0) {
      alert("No changes detected!");
      setIsEditModalOpen(false);
    } else {
      const { error } = await supabase
        .from(table)
        .update(editedFields)
        .eq("id", selectedProduct!.id);
      if (error) {
        console.log("Error editing row: ", error.message);
      } else {
        alert("Changes saved!");
        setEditedFields({ active: false, approved: false });
      }
    }
  };

  // Handle product being selected for bulk action
  const handleCheck = (productId: string) => {
    setSelectedProducts((prev) => {
      const newProducts = new Set(prev);
      if (newProducts.has(productId)) {
        // add product if row is checked
        newProducts.delete(productId); // Remove if already selected
      } else {
        // Add if not selected
        newProducts.add(productId);
      }
      return newProducts;
    });
  };

  const saveBulkChanges = async () => {
    let table = "";
    if (productType == "Liquid") {
      table = "liquid_ingredients";
    } else {
      table = "powder_ingredients";
    }

    let fieldToUpdate = "";
    let value = true;
    if (actionMode == "approve") {
      fieldToUpdate = "approved";
    }
    if (actionMode == "activate") {
      fieldToUpdate = "active";
    }
    if (actionMode == "deactivate") {
      fieldToUpdate = "active";
      value = false;
    }

    const { error } = await supabase
      .from(table)
      .update({ [fieldToUpdate]: value })
      .in("id", Array.from(selectedProducts));
    if (error) {
      console.log("Error updated table with bulk action: ", error.message);
    } else {
      alert("Changes have been saved successfully.");
      setSelectedProducts(new Set());
      setActionMode("default");
      await getFormulas(productType);
    }
  };

  useEffect(() => {
    getFormulas("Liquid"); // Load liquid table by default
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // find the index of the fat_sources column so we can apply a minWidth to both header and cells
  const fatIndex = columns ? columns.findIndex((c) => String(c) === "fat_sources") : -1;

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
                    value="All"
                  >
                    All
                  </SelectItem>
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
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold">Sort:</span>
            <Select onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="w-40 bg-white rounded-xl text-text">
                <SelectValue defaultValue="none" placeholder="None" />
              </SelectTrigger>
              <SelectContent className="bg-white w-fit rounded">
                <SelectGroup className="bg-white">
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="none"
                  >
                    None
                  </SelectItem>
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="az"
                  >
                    Product Name A - Z
                  </SelectItem>
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="za"
                  >
                    Product Name Z - A
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
              {(actionMode == "default" || actionMode == "activate") && (
                <Button
                  variant="default"
                  className="rounded-full bg-green-600"
                  size="sm"
                  onClick={() => setActionMode("activate")}
                >
                  <ShieldCheck /> Activate
                </Button>
              )}
              {(actionMode == "default" || actionMode == "deactivate") && (
                <Button
                  variant="default"
                  className="rounded-full bg-red-600"
                  size="sm"
                  onClick={() => setActionMode("deactivate")}
                >
                  <ShieldMinus /> Deactivate
                </Button>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto overflow-y-auto max-h-96">
          <table className="w-full text-sm table-auto border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="text-left">
                {actionMode != "default" && (
                  <th className="py-5 px-2 font-semibold bg-gray-50 sticky top-0 left-0 z-30 border-gray-300 border-l-0">
                    Select All
                  </th>
                )}
                {columns!.map((column, idx) => (
                  <th
                    key={column}
                    className="py-2 px-10 font-semibold top-0 z-30 bg-gray-50 text-left border border-gray-300 border-t-0 border-l-0 border-r-0 border-b-2"
                    style={idx === fatIndex ? { minWidth: "20rem" } : undefined}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedProducts?.map((product) => (
                <tr key={product.id} className="text-right hover:bg-gray-50 ">
                  {actionMode != "default" && (
                    <td className="border border-gray-200 py-2 px-2 border-l-0">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(product.id)} // Controlled by React state
                          disabled={
                            (actionMode === "approve" && product.approved) ||
                            (actionMode === "activate" && product.active) ||
                            (actionMode === "activate" && !product.approved) ||
                            (actionMode === "deactivate" && !product.active) ||
                            (actionMode === "activate" && !product.approved) ||
                            actionMode === "default"
                          }
                          onChange={() => {
                            handleCheck(product.id);
                            console.log(selectedProducts);
                          }} // Updates state on change
                          className="disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </label>
                    </td>
                  )}

                  <td className={`py-2 px-2 border text-left border-gray-200 ${actionMode === "default" ? "border-l-0" : ""}`}>
                    <div className="flex items-center justify-between">
                      <span>{product.product || ""}</span>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsEditModalOpen(true);
                          console.log(product.id);
                        }}
                        className="text-gray-600 hover:text-gray-900 ml-2"
                      >
                        <span className="text-xl">
                          <Pencil />
                        </span>
                      </button>
                    </div>
                  </td>
                  {columns?.slice(1).map((column, restIdx) => (
                    <td
                      key={String(column)}
                      className={`py-2 px-2 border border-gray-200 ${
                        restIdx === (columns!.slice(1).length - 1) ? "border-r-0" : ""
                      }`}
                      // adjust for the sliced index: original index = restIdx + 1
                      style={restIdx + 1 === fatIndex ? { minWidth: "15rem" } : undefined}
                    >
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
              {(actionMode == "default" || actionMode == "approve") && (
                <Button
                  variant="default"
                  className="rounded-full"
                  size="sm"
                  onClick={() => setActionMode("approve")}
                >
                  <Check /> Approve
                </Button>
              )}
            </div>
          ) : (
            <></>
          )}
          {actionMode == "default" && (
            <div>
              <Button
                onClick={() => {
                  setSelectedProduct(null);
                  setIsAddModalOpen(true);
                }}
                variant="default"
                className="rounded-full"
                size="sm"
              >
                <Plus /> Add Entry
              </Button>
            </div>
          )}

          {actionMode != "default" && (
            <div className="flex gap-[10%] ">
              <Button
                variant="default"
                className="rounded-full bg-green-700"
                size="sm"
                onClick={() => {
                  saveBulkChanges();
                }}
                disabled={selectedProducts.size == 0}
              >
                Save Changes
              </Button>

              <Button
                variant="outline"
                className="rounded-full"
                size="sm"
                onClick={() => {
                  setSelectedProducts(new Set());
                  alert("Canceled changes successfully.");
                  setActionMode("default");
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative overflow-y-auto max-h-[80%]">
            {/* Close button */}
            <button
              onClick={() => {
                setEditedFields({ active: false, approved: false });
                setIsEditModalOpen(false);
              }}
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
                      (editedFields[
                        column as keyof typeof editedFields
                      ] as string) || ""
                    }
                    onChange={(e) =>
                      handleEditEntryFieldChange(
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
                  setEditedFields({ active: false, approved: false });
                  setIsEditModalOpen(false);
                }}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  editProduct(productType == "Liquid");
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
              onClick={() => {
                setNewProduct({});
                setIsAddModalOpen(false);
              }}
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
                      handleAddEntryFieldChange(
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
