import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import PersianDatePicker from "./PersianDatePicker";

interface SearchFilterProps {
  onSearch: (value: string) => void;
  onFilter: (date: string) => void;
  searchValue: string;
  filterDate: string;
  onClearFilters: () => void;
}

export default function SearchFilter({ 
  onSearch, 
  onFilter, 
  searchValue, 
  filterDate,
  onClearFilters
}: SearchFilterProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(e.currentTarget.value);
    }
  };

  const handleDateChange = (date: string) => {
    onFilter(date);
  };

  return (
    <section className="mb-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">جستجو و فیلتر</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="search-id" className="block text-sm font-medium text-gray-700">
                جستجو با کد پیگیری
              </label>
              <div className="relative">
                <Input
                  id="search-id"
                  value={searchValue}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  placeholder="کد پیگیری را وارد کنید"
                  className="pr-10 pl-4"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-end gap-2">
              <Button 
                onClick={() => {
                  if (searchValue) {
                    onSearch(searchValue);
                  }
                }}
                className="w-full bg-primary hover:bg-primary/90"
              >
                اعمال فیلتر
              </Button>
              
              {searchValue && (
                <Button 
                  onClick={onClearFilters}
                  variant="outline"
                  className="min-w-[80px]"
                >
                  پاک کردن
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
