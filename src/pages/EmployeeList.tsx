import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Company, Employee } from "@/types";
import EmployeeCard from "@/components/EmployeeCard";
import AIToggle from "@/components/AIToggle";
import { toast } from "sonner";
import { simulateAISelection } from "@/utils/mockData";
import { searchEmployees, searchCompanies } from "@/lib/apolloApi";

const EmployeeList = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [aiMode, setAiMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Retrieve companies from session storage
    const storedCompanies = sessionStorage.getItem("companies");
    if (storedCompanies) {
      const parsedCompanies = JSON.parse(storedCompanies);
      setCompanies(parsedCompanies);

      // Select the first company by default
      if (parsedCompanies.length > 0) {
        setSelectedCompanyId(parsedCompanies[0].id);
        fetchEmployees(extractCompanyDomain(parsedCompanies[0].name),parsedCompanies[0].query, parsedCompanies[0].countries || []);
      }
    } else {
      // If no companies found, redirect back to the index page
      navigate("/");
      toast.error("No companies selected. Please start again.");
    }
  }, [navigate]);
  const extractCompanyDomain = (linkedinUrl: string): string => {
    try {
      // Extract company name from URL
      // Format: https://www.linkedin.com/company/company-name/
      const urlPattern = /linkedin\.com\/company\/([^\/]+)/i;
      const match = linkedinUrl.match(urlPattern);

      if (match && match[1]) {
        return match[1];
      }
      return linkedinUrl; // Return the original if parsing fails
    } catch (error) {
      console.error('Error extracting company domain:', error);
      return linkedinUrl;
    }
  };
  const fetchEmployees = async (companyId: string,query: string, regions: string[] = []) => {
    setLoading(true);

    try {
      const companyName = await searchCompanies(companyId, regions);
      const fetchedEmployees = await searchEmployees(companyName.id, query, regions);
      setEmployees(fetchedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to fetch employees. Please try again.');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
    const selectedCompany = companies.find(c => c.id === companyId);
    if (selectedCompany) {
      fetchEmployees(extractCompanyDomain(selectedCompany.name), selectedCompany.query, selectedCompany.countries || []);
    }

    // Reset employee selections when changing company
    setEmployees(prev => prev.map(emp => ({ ...emp, selected: false })));
  };

  const handleAIToggle = (enabled: boolean) => {
    setAiMode(enabled);

    if (enabled) {
      // Find the selected company to get its query
      const selectedCompany = companies.find(c => c.id === selectedCompanyId);
      if (selectedCompany) {
        const selectedEmployees = simulateAISelection(employees, selectedCompany.query);
        setEmployees(selectedEmployees);

        toast.success(`AI selected ${selectedEmployees.filter(e => e.selected).length} employees based on your query`);
      }
    } else {
      // Reset selections when turning off AI mode
      setEmployees(prev => prev.map(emp => ({ ...emp, selected: false })));
    }
  };

  const toggleEmployeeSelection = (employeeId: string) => {
    if (aiMode) return; // Don't allow manual selection in AI mode

    setEmployees(prev =>
      prev.map(emp =>
        emp.id === employeeId
          ? { ...emp, selected: !emp.selected }
          : emp
      )
    );
  };

  const handleSubmit = () => {
    const selectedEmployees = employees.filter(emp => emp.selected);

    if (selectedEmployees.length === 0) {
      toast.warning("Please select at least one employee");
      return;
    }

    // Store selected employees in session storage
    sessionStorage.setItem("selectedEmployees", JSON.stringify(selectedEmployees));

    // Navigate to employee details page
    navigate("/employee-details");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-blue-600 py-6">
        <Container>
          <h1 className="text-3xl font-bold text-white">Employee Results</h1>
          <p className="text-blue-100 mt-2">
            Select employees from the list or let AI choose for you
          </p>
        </Container>
      </div>

      <Container className="py-8">
        <div className="max-w-5xl mx-auto">
          <Card className="p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="w-full md:w-1/3">
                <Label htmlFor="company-select">Select Company</Label>
                <Select
                  value={selectedCompanyId}
                  onValueChange={handleCompanyChange}
                >
                  <SelectTrigger id="company-select">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-2/3">
                <AIToggle onChange={handleAIToggle} />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {loading ? (
                  "Loading employees..."
                ) : (
                  <>Showing {employees.length} employees • {employees.filter(e => e.selected).length} selected</>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                View Detailed Information
              </Button>
            </div>
          </Card>

          <ScrollArea className="h-[calc(100vh-280px)]">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Card key={i} className="p-4 h-32 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-gray-200" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : employees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-2">
                {employees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    selectable={!aiMode}
                    onClick={() => toggleEmployeeSelection(employee.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No employees found for this company</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </Container>
    </div>
  );
};

export default EmployeeList;
