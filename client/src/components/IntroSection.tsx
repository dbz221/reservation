import { Card, CardContent } from "@/components/ui/card";

export default function IntroSection() {
  return (
    <section className="mb-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">راهنمای سامانه</h2>
          <p className="text-gray-700 mb-4">
            به سامانه مدیریت نوبت‌دهی رویداد خوش آمدید. در این سامانه می‌توانید اطلاعات درخواست رزرو خود را وارد کنید و زمان نوبت تعیین شده را مشاهده نمایید.
          </p>
          <div className="bg-blue-50 border-r-4 border-blue-500 p-4 text-blue-700">
            <p className="font-bold">مراحل استفاده:</p>
            <ol className="list-decimal mr-5 mt-2 space-y-1">
              <li>ابتدا فرم «ثبت نوبت جدید» را تکمیل کنید.</li>
              <li>برای هر ثبت، یک کد پیگیری دریافت خواهید کرد که برای ویرایش اطلاعات نیاز است.</li>
              <li>از بخش جستجو می‌توانید اطلاعات خود را پیدا کنید.</li>
              <li>برای ویرایش، کد پیگیری را وارد کنید.</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
