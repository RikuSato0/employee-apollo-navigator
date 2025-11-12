
import { Container } from "@/components/ui/container";
import { ScrollArea } from "@/components/ui/scroll-area";
import CompanyForm from "@/components/CompanyForm";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-blue-600 py-6">
        <Container className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Employee Apollo Navigator</h1>
            <p className="text-blue-100 mt-2">Find the right employees from any company</p>
          </div>
        </Container>
      </div>
      
      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          <ScrollArea className="h-[calc(100vh-180px)] pr-4">
            <CompanyForm />
          </ScrollArea>
        </div>
      </Container>
    </div>
  );
};

export default Index;

