
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Employee } from "@/types";
import { cn } from "@/lib/utils";

interface EmployeeCardProps {
  employee: Employee;
  selectable?: boolean;
  onClick?: () => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ 
  employee, 
  selectable = false,
  onClick 
}) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md border overflow-hidden",
        employee.selected && "ring-2 ring-blue-500 shadow-md",
        selectable && "hover:border-blue-300"
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4 p-4">
        <div className="flex-shrink-0">
          <img 
            src={employee.profileImage} 
            alt={employee.name}
            className="h-16 w-16 rounded-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {employee.name}
          </h3>
          <p className="text-sm text-blue-600 font-medium">
            {employee.title}
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              {employee.department}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              {employee.location}
            </span>
          </div>
        </div>
        {selectable && (
          <div className="flex-shrink-0 self-center">
            <div className={cn(
              "h-6 w-6 rounded-full border-2",
              employee.selected 
                ? "bg-blue-500 border-blue-500" 
                : "border-gray-300"
            )}>
              {employee.selected && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="white" 
                  className="w-5 h-5"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" 
                    clipRule="evenodd" 
                  />
                </svg>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EmployeeCard;
