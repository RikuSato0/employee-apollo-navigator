
import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn("container px-4 mx-auto", className)}>
      {children}
    </div>
  );
};
