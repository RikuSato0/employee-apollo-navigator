
export type Country = string;

export type EmployeeType = "current" | "former" | "both";

export type Company = {
  id: string;
  name: string;
  countries: Country[];
  employeeType: EmployeeType;
  query: string;
};

export type Employee = {
  id: string;
  name: string;
  title: string;
  company: string;
  companyId: string;
  department: string;
  location: string;
  linkedin: string;
  profileImage: string;
  selected?: boolean;
};

export type EmployeeDetail = Employee & {
  email: string;
  phone: string;
  linkedin: string;
  twitter_url: string;
  skills: string[];
  experience: {
    company: string;
    title: string;
    duration: string;
  }[];
};
