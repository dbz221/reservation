import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntroSection from "@/components/IntroSection";
import SearchFilter from "@/components/SearchFilter";
import AppointmentList from "@/components/AppointmentList";
import AppointmentForm from "@/components/AppointmentForm";
import EditIdModal from "@/components/EditIdModal";
import SuccessModal from "@/components/SuccessModal";
import { Appointment } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditIdModalOpen, setIsEditIdModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [successMessage, setSuccessMessage] = useState({
    title: "",
    message: "",
    id: ""
  });
  const [searchValue, setSearchValue] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const { toast } = useToast();

  const { 
    data: appointments = [], 
    isLoading,
    refetch
  } = useQuery<Appointment[]>({
    queryKey: ['/api/appointments']
  });

  const { mutate: createAppointment } = useMutation({
    mutationFn: async (appointmentData: Omit<Appointment, 'id' | 'uniqueId' | 'createdAt'>) => {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create appointment');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      setSuccessMessage({
        title: "نوبت با موفقیت ثبت شد",
        message: "کد پیگیری خود را برای ویرایش نگهداری کنید:",
        id: data.uniqueId
      });
      setIsFormModalOpen(false);
      setIsSuccessModalOpen(true);
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "در ثبت نوبت خطایی رخ داد. لطفا دوباره تلاش کنید.",
        variant: "destructive"
      });
    }
  });

  const { mutate: updateAppointment } = useMutation({
    mutationFn: async ({ 
      uniqueId, 
      data 
    }: { 
      uniqueId: string, 
      data: Partial<Appointment> 
    }) => {
      const response = await fetch(`/api/appointments/${uniqueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update appointment');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      setSuccessMessage({
        title: "اطلاعات با موفقیت بروزرسانی شد",
        message: "تغییرات شما با موفقیت ذخیره شد:",
        id: data.uniqueId
      });
      setCurrentAppointment(null);
      setIsFormModalOpen(false);
      setIsSuccessModalOpen(true);
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "در بروزرسانی نوبت خطایی رخ داد. لطفا دوباره تلاش کنید.",
        variant: "destructive"
      });
    }
  });

  const { mutate: getAppointmentByUniqueId } = useMutation({
    mutationFn: async (uniqueId: string) => {
      const response = await fetch(`/api/appointments/${uniqueId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("کد پیگیری نامعتبر است.");
        }
        throw new Error("خطا در دریافت اطلاعات");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentAppointment(data);
      setIsEditIdModalOpen(false);
      setIsFormModalOpen(true);
    },
    onError: (error) => {
      toast({
        title: "خطا",
        description: error instanceof Error ? error.message : "خطا در دریافت اطلاعات",
        variant: "destructive"
      });
    }
  });

  const handleNewAppointment = () => {
    setCurrentAppointment(null);
    setIsFormModalOpen(true);
  };

  const handleAppointmentSubmit = (appointmentData: any) => {
    if (currentAppointment) {
      updateAppointment({ 
        uniqueId: currentAppointment.uniqueId, 
        data: appointmentData 
      });
    } else {
      createAppointment(appointmentData);
    }
  };

  const handleEditClick = (uniqueId: string) => {
    // If a uniqueId is passed, use it directly
    if (uniqueId) {
      const appointment = appointments.find(a => a.uniqueId === uniqueId);
      if (appointment) {
        setCurrentAppointment(appointment);
        setIsFormModalOpen(true);
        return;
      }
    }
    
    // Otherwise, show the edit ID modal
    setIsEditIdModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleFilter = (date: string) => {
    setFilterDate(date);
  };

  const filteredAppointments = appointments.filter(appointment => {
    let matchesSearch = true;
    let matchesFilter = true;
    
    if (searchValue) {
      matchesSearch = appointment.uniqueId.includes(searchValue);
    }
    
    if (filterDate) {
      matchesFilter = appointment.appointmentDate === filterDate;
    }
    
    return matchesSearch && matchesFilter;
  });

  const clearFilters = () => {
    setSearchValue("");
    setFilterDate("");
  };

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Header onNewAppointment={handleNewAppointment} />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <IntroSection />
        
        <SearchFilter 
          onSearch={handleSearch} 
          onFilter={handleFilter}
          searchValue={searchValue}
          filterDate={filterDate}
          onClearFilters={clearFilters}
        />
        
        <AppointmentList 
          appointments={filteredAppointments} 
          isLoading={isLoading}
          onEditClick={handleEditClick}
        />
      </main>
      
      <Footer />
      
      <AppointmentForm 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleAppointmentSubmit}
        appointment={currentAppointment}
        isEditing={!!currentAppointment}
      />
      
      <EditIdModal 
        isOpen={isEditIdModalOpen} 
        onClose={() => setIsEditIdModalOpen(false)}
        onSubmit={(uniqueId) => getAppointmentByUniqueId(uniqueId)}
      />
      
      <SuccessModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)}
        title={successMessage.title}
        message={successMessage.message}
        id={successMessage.id}
      />
    </div>
  );
}
