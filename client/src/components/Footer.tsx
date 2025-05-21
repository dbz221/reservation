export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">تمامی حقوق محفوظ است &copy; {new Date().toLocaleDateString('fa-IR', { year: 'numeric' })}</p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-gray-300 hover:text-white">
              <span className="ml-2">پشتیبانی</span>
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <span className="ml-2">تماس با ما</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
