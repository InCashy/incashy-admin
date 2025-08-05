import React from "react";
import carriersData from "./data.json"; // Adjust path if needed
import SearchBar from "@/components/custom/search-bar";
import CompanyCard from "@/components/custom/company-card";

export const metadata = {
  title: "Carriers",
  description: "carriers",
  alternates: {
    canonical: "https://www.incashy.com",
  },
};




// Create display-friendly card data
const enrichedCarriers = carriersData.carriers.map((carrier) => {
  <companyCard carrier key={carrier.dot_number} company={carrier} />
});

const CarriersPage = () => {
  return (
    <div className="p-4">
      <SearchBar />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {carriersData.carriers.map((carrier) => (
          <CompanyCard carrier key={carrier.dot_number} company={carrier} />
        ))}
      </div>
    </div>
  );
};


export default CarriersPage;
