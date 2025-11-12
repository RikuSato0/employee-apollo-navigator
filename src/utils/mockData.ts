import { Company, Employee, EmployeeDetail } from "@/types";

export const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Microsoft",
    countries: ["United States", "Canada"],
    employeeType: "current",
    query: "software engineer"
  },
  {
    id: "2",
    name: "Apple",
    countries: ["United States", "Ireland"],
    employeeType: "current",
    query: "product manager"
  },
  {
    id: "3",
    name: "Google",
    countries: ["United States", "Germany", "Singapore"],
    employeeType: "both",
    query: "data scientist"
  }
];



export const simulateAISelection = (employees: Employee[], query: string): Employee[] => {
  const shuffled = [...employees].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10).map(emp => ({ ...emp, selected: true }));
};
