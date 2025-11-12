
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

interface AIToggleProps {
  onChange: (enabled: boolean) => void;
}

const AIToggle: React.FC<AIToggleProps> = ({ onChange }) => {
  const [enabled, setEnabled] = useState(false);

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    onChange(checked);
  };

  return (
    <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
      <div className="flex items-center space-x-2">
        <Switch
          id="ai-mode"
          checked={enabled}
          onCheckedChange={handleToggle}
        />
        <Label htmlFor="ai-mode" className="cursor-pointer flex items-center">
          <Sparkles 
            size={18} 
            className={`mr-2 ${enabled ? 'text-blue-600' : 'text-gray-400'}`} 
          />
          <span>AI Selection {enabled ? "(Automatic)" : "(Manual)"}</span>
        </Label>
      </div>
      <div className="text-xs text-gray-500 ml-2">
        {enabled 
          ? "AI will automatically select the most relevant employees" 
          : "Select employees manually by clicking on their cards"}
      </div>
    </div>
  );
};

export default AIToggle;
