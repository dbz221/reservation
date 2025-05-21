import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  id: string;
}

export default function SuccessModal({ isOpen, onClose, title, message, id }: SuccessModalProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyId = () => {
    navigator.clipboard.writeText(id).then(() => {
      setCopied(true);
      toast({
        title: "کپی شد",
        description: "کد نوبت با موفقیت کپی شد",
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader className="flex flex-row items-center gap-4">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <DialogTitle className="text-right">{title}</DialogTitle>
            <DialogDescription className="text-right text-sm text-gray-500">
              اطلاعات با موفقیت ذخیره شد
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-700 mb-3">
            {message}
          </p>
          
          <div className="flex items-center p-3 bg-gray-100 rounded-md">
            <span className="font-bold text-primary flex-grow">{id}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopyId}
              className="flex-shrink-0"
            >
              <Copy className="h-4 w-4 mr-1" />
              {copied ? "کپی شد" : "کپی کد"}
            </Button>
          </div>
          
          <p className="text-gray-600 mt-4 text-sm">
            لطفا این کد را برای ویرایش اطلاعات در آینده نگهداری کنید. بدون این کد امکان ویرایش اطلاعات وجود ندارد.
          </p>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>متوجه شدم</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
