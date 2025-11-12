import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Employee, EmployeeDetail } from "@/types";
import { toast } from "sonner";
import { Mail, Phone, Linkedin, Building, MapPin, Briefcase } from "lucide-react";
import { fetchPersonalInfos } from "@/lib/apolloApi";

const EmployeeDetails = () => {
  const navigate = useNavigate();
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    // Retrieve selected employees from session storage
    const storedEmployees = sessionStorage.getItem("selectedEmployees");
    
    if (storedEmployees) {
      const parsedEmployees = JSON.parse(storedEmployees) as Employee[];
      
      if (parsedEmployees.length > 0) {
        setLoading(true);
        
        // Fetch detailed information using the Apollo API
        fetchEmployeeDetails(parsedEmployees);
      } else {
        navigateBack();
        toast.error("No employees selected. Please try again.");
      }
    } else {
      navigateBack();
      toast.error("No employees selected. Please try again.");
    }
  }, []);
  
  const fetchEmployeeDetails = async (employees: Employee[]) => {
    try {
      console.log(employees,'=>employees')
      const detailedEmployees = await fetchPersonalInfos(employees);
      setEmployeeDetails(detailedEmployees);
      
      if (detailedEmployees.length > 0) {
        setActiveTab(detailedEmployees[0].id);
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
      toast.error('Failed to fetch employee details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateBack = () => {
    navigate("/employee-list");
  };

  const handleStartOver = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-blue-600 py-6">
        <Container>
          <h1 className="text-3xl font-bold text-white">Employee Details</h1>
          <p className="text-blue-100 mt-2">
            Detailed information about your selected employees
          </p>
        </Container>
      </div>
      
      <Container className="py-8">
        <div className="mb-6 flex justify-between">
          <Button
            variant="outline"
            onClick={navigateBack}
          >
            Back to Results
          </Button>
          
          <Button
            onClick={handleStartOver}
          >
            Start New Search
          </Button>
        </div>
        
        {loading ? (
          <div className="max-w-5xl mx-auto">
            <Card className="p-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
              </div>
            </Card>
          </div>
        ) : employeeDetails.length > 0 ? (
          <div className="max-w-5xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <ScrollArea className="w-full">
                <TabsList className="flex w-full h-auto p-2 bg-blue-50 border border-blue-100 mb-6">
                  {employeeDetails.map((employee) => (
                    <TabsTrigger
                      key={employee.id}
                      value={employee.id}
                      className="flex-shrink-0 data-[state=active]:bg-white data-[state=active]:shadow"
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src={employee.profileImage}
                          alt={employee.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <span>{employee.name}</span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>

              {employeeDetails.map((employee) => (
                <TabsContent key={employee.id} value={employee.id}>
                  <Card>
                    <CardHeader className="flex flex-col md:flex-row md:items-center gap-6 pb-2">
                      <div className="flex-shrink-0">
                        <img
                          src={employee.profileImage}
                          alt={employee.name}
                          className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{employee.name}</CardTitle>
                        <p className="text-xl text-blue-600 font-medium">
                          {employee.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Building size={16} className="text-gray-500" />
                          <span className="text-gray-700">{employee.company}</span>
                          <span className="text-gray-400">•</span>
                          <MapPin size={16} className="text-gray-500" />
                          <span className="text-gray-700">{employee.location}</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium border-b pb-2">Contact Information</h3>
                          
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center space-x-3">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <Mail size={18} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{employee.email}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <Phone size={18} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{employee.phone}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <Linkedin size={18} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">LinkedIn</p>
                                <a 
                                  href={employee.linkedin} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="font-medium text-blue-600 hover:underline"
                                >
                                  View Profile
                                </a>
                              </div>
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-medium border-b pb-2 mt-6">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {employee.skills.map((skill, index) => (
                              <span 
                                key={index}
                                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium border-b pb-2">Work Experience</h3>
                          
                          <div className="space-y-4">
                            {employee.experience.map((exp, index) => (
                              <div key={index} className="border-l-2 border-blue-200 pl-4 py-1">
                                <div className="flex items-center space-x-2">
                                  <Briefcase size={16} className="text-blue-600" />
                                  <h4 className="font-medium">{exp.title}</h4>
                                </div>
                                <p className="text-gray-600">{exp.company}</p>
                                <p className="text-sm text-gray-500">{exp.duration}</p>
                              </div>
                            ))}
                          </div>
                          
                          {employee.experience.length === 0 && (
                            <p className="text-gray-500 italic">No work experience information available</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        ) : (
          <Card className="p-6">
            <div className="text-center">
              <p className="text-gray-500 mb-4">No employee details available</p>
              <Button variant="outline" onClick={navigateBack}>
                Go Back
              </Button>
            </div>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default EmployeeDetails;
