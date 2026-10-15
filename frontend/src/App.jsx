import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import Assistant from "./components/Assistant.jsx";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import TeamBuilder from "./pages/TeamBuilder.jsx";
import Workload from "./pages/Workload.jsx";
import Risks from "./pages/Risks.jsx";
import WhatIf from "./pages/WhatIf.jsx";

import Hiring from "./pages/Hiring.jsx";

// API status
import {
  subscribeConnectionStatus,
  checkBackendHealth,
  getConnectionStatus
} from "./api.js";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [connectionStatus, setConnectionStatus] = useState(getConnectionStatus());
  const [demoTrigger, setDemoTrigger] = useState(0);
  const [prefillData, setPrefillData] = useState(null);

  // Subscribe to connection changes and check backend connectivity
  useEffect(() => {
    const unsubscribe = subscribeConnectionStatus((status) => {
      setConnectionStatus(status);
    });

    // Initial check
    checkBackendHealth();

    // Re-check periodically every 15s in background
    const interval = setInterval(() => {
      checkBackendHealth();
    }, 15000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleNavigate = (page, prefill = null) => {
    setCurrentPage(page);
    if (prefill) {
      setPrefillData(prefill);
    }
  };

  const handleRunDemo = () => {
    setCurrentPage("teambuilder");
    setDemoTrigger((prev) => prev + 1);
  };

  const handleRefreshHealth = async () => {
    await checkBackendHealth();
  };

  // Render current view
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard
            onNavigate={handleNavigate}
            connectionStatus={connectionStatus}
            searchTerm={searchTerm}
          />
        );
      case "teambuilder":
        return (
          <TeamBuilder
            connectionStatus={connectionStatus}
            demoTrigger={demoTrigger}
            onNavigate={handleNavigate}
          />
        );
      case "workload":
        return (
          <Workload
            connectionStatus={connectionStatus}
            searchTerm={searchTerm}
          />
        );
      case "risks":
        return (
          <Risks
            connectionStatus={connectionStatus}
            onNavigate={handleNavigate}
          />
        );
      case "whatif":
        return (
          <WhatIf
            connectionStatus={connectionStatus}
            onNavigate={handleNavigate}
          />
        );
      case "hiring":
        return (
          <Hiring
            prefillData={prefillData}
            onClearPrefill={() => setPrefillData(null)}
          />
        );
      default:
        return (
          <Dashboard
            onNavigate={handleNavigate}
            connectionStatus={connectionStatus}
            searchTerm={searchTerm}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Fixed Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        connectionStatus={connectionStatus}
      />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Sticky Topbar */}
        <Topbar
          currentPage={currentPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRunDemo={handleRunDemo}
          connectionStatus={connectionStatus}
          onRefreshHealth={handleRefreshHealth}
        />

        {/* Page View with subtle Framer Motion transition */}
        <main className="page-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {renderCurrentPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating AI Assistant Drawer */}
      <Assistant onNavigate={setCurrentPage} />
    </div>
  );
}
