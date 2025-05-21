interface HeaderProps {
  onNewAppointment: () => void;
}

export default function Header({ onNewAppointment }: HeaderProps) {
  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">سامانه مدیریت نوبت‌دهی رویداد</h1>
        <div>
          <button 
            onClick={onNewAppointment}
            className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition duration-200"
          >
            ثبت نوبت جدید
          </button>
        </div>
      </div>
    </header>
  );
}
