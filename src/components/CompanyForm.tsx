import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Company, EmployeeType } from "@/types";
import { toast } from "sonner";
import CountriesSelect from "./CountriesSelect";
import { Search } from "lucide-react";
import { searchCompanies } from "@/lib/apolloApi";

const employeeTypes: { value: EmployeeType; label: string }[] = [
  { value: "current", label: "Current Employees" },
  { value: "former", label: "Former Employees" },
  { value: "both", label: "Both" }
];

const CompanyForm: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      name: "",
      countries: [],
      employeeType: "current",
      query: ""
    }
  ]);
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  
  // Global country selection state
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const handleAddCompany = () => {
    if (companies.length >= 10) {
      toast.warning("Maximum of 10 companies allowed");
      return;
    }
    
    setCompanies([
      ...companies,
      {
        id: (companies.length + 1).toString(),
        name: "",
        countries: selectedCountries,
        employeeType: "current",
        query: ""
      }
    ]);
  };

  const handleRemoveCompany = (index: number) => {
    if (companies.length <= 1) {
      toast.warning("At least one company is required");
      return;
    }
    
    setCompanies(companies.filter((_, i) => i !== index));
  };

  const updateCompany = (index: number, field: keyof Company, value: any) => {
    const updatedCompanies = [...companies];
    updatedCompanies[index] = {
      ...updatedCompanies[index],
      [field]: value
    };
    setCompanies(updatedCompanies);
  };

  // When countries are selected globally, update all companies
  const handleGlobalCountryChange = (countries: string[]) => {
    setSelectedCountries(countries);
    
    // Update all companies with the new countries
    const updatedCompanies = companies.map(company => ({
      ...company,
      countries
    }));
    
    setCompanies(updatedCompanies);
  };

  const searchCompanyInfo = async (index: number) => {
    const company = companies[index];
    
    if (!company.name.trim()) {
      toast.error("Please enter a company name first");
      return;
    }
    
    if (company.countries.length === 0) {
      toast.warning("Please select at least one country");
      return;
    }
    
    // Set loading state for this company
    setLoading(prev => ({ ...prev, [index]: true }));
    
    try {
      // Search for company using Apollo API
      const companyInfo = await searchCompanies(company.name, company.countries);
      
      if (companyInfo) {
        // Update the company with the information returned from the API
        const updatedCompanies = [...companies];
        updatedCompanies[index] = {
          ...company,
          id: companyInfo.id || company.id,
          name: companyInfo.name || company.name,
        };
        
        setCompanies(updatedCompanies);
        toast.success(`Found company: ${companyInfo.name}`);
      } else {
        toast.error(`Could not find company: ${company.name}`);
      }
    } catch (error) {
      console.error('Error searching for company:', error);
      toast.error('Failed to search for company. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const isValid = companies.every(company => 
      company.name.trim() !== "" && 
      company.countries.length > 0 && 
      company.query.trim() !== ""
    );
    
    if (!isValid) {
      toast.error("Please fill in all required fields for each company");
      return;
    }
    
    // Store companies in session storage to be accessed in the employee list page
    sessionStorage.setItem("companies", JSON.stringify(companies));
    
    // Navigate to employee list page
    navigate("/employee-list");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Company Selection</h2>
        <Button 
          type="button" 
          onClick={handleAddCompany}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Company
        </Button>
      </div>
      
      {/* Global Countries Selection */}
      <Card className="border border-blue-100">
        <CardHeader>
          <CardTitle>Select Countries (applies to all companies)</CardTitle>
        </CardHeader>
        <CardContent>
          <CountriesSelect 
            selectedCountries={selectedCountries}
            onSelectionChange={handleGlobalCountryChange}
          />
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {companies.map((company, index) => (
          <Card key={index} className="border border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                Company {index + 1}
              </CardTitle>
              {companies.length > 1 && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleRemoveCompany(index)}
                >
                  Remove
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`company-name-${index}`}>Company Name</Label>
                <div className="flex space-x-2">
                  <Input
                    id={`company-name-${index}`}
                    value={company.name}
                    onChange={(e) => updateCompany(index, "name", e.target.value)}
                    placeholder="Enter company name"
                    required
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => searchCompanyInfo(index)}
                    disabled={loading[index]}
                    className="min-w-[100px]"
                  >
                    {loading[index] ? "Searching..." : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`employee-type-${index}`}>Employee Type</Label>
                <Select
                  value={company.employeeType}
                  onValueChange={(value) => updateCompany(index, "employeeType", value as EmployeeType)}
                >
                  <SelectTrigger id={`employee-type-${index}`}>
                    <SelectValue placeholder="Select employee type" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`query-${index}`}>Search Query</Label>
                <Input
                  id={`query-${index}`}
                  value={company.query}
                  onChange={(e) => updateCompany(index, "query", e.target.value)}
                  placeholder="Enter search query (e.g., 'software engineer', 'marketing expert')"
                  required
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <CardFooter className="flex justify-end">
        <Button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          Find Employees
        </Button>
      </CardFooter>
    </form>
  );
};

export default CompanyForm;
