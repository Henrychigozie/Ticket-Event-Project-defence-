import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../pages/DashboardHeader";


const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Fixed position */}
      <aside className="fixed left-0 top-0 h-screen z-30 lg:relative lg:flex">
        <Sidebar />
      </aside>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header - Sticky at top */}
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm">
          <DashboardHeader />
        </header>
        
        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;