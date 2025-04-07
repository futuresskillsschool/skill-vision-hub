
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface PDFDownloadButtonProps {
  onDownload: () => Promise<void>;
  className?: string;
}

const PDFDownloadButton = ({ onDownload, className = "" }: PDFDownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = async () => {
    if (isDownloading) return;
    
    try {
      setIsDownloading(true);
      toast.loading("Generating your PDF report...");
      await onDownload();
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("There was an error generating your PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      onClick={handleDownload} 
      disabled={isDownloading} 
      className={`flex items-center gap-2 ${className}`}
    >
      <Download className="h-4 w-4" />
      {isDownloading ? 'Generating...' : 'Download PDF'}
    </Button>
  );
};

export default PDFDownloadButton;
