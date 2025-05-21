import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound } from "lucide-react";

interface EditIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (uniqueId: string) => void;
}

export default function EditIdModal({ isOpen, onClose, onSubmit }: EditIdModalProps) {
  const [uniqueId, setUniqueId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmedId = uniqueId.trim();
    if (!trimmedId) {
      setError("کد پیگیری را وارد کنید");
      return;
    }
    
    setError("");
    onSubmit(trimmedId);
  };

  const handleClose = () => {
    setUniqueId("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <KeyRound className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">ویرایش اطلاعات با کد پیگیری</DialogTitle>
          <DialogDescription>
            کد پیگیری که هنگام ثبت نوبت دریافت کرده‌اید را وارد کنید
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-id-input" className="block text-sm font-medium text-gray-700 mb-2">
                کد پیگیری
              </Label>
              <Input
                id="edit-id-input"
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="مثال: APT-1001"
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
            <p className="text-sm text-gray-500">
              با وارد کردن کد پیگیری، می‌توانید اطلاعات نوبت خود را مشاهده و ویرایش کنید.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>انصراف</Button>
          <Button onClick={handleSubmit} className="mr-2">
            ادامه
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
