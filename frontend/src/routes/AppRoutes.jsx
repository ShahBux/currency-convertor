import { Navigate, Route, Routes } from "react-router-dom";
import ConverterPage from "../pages/ConverterPage";
import HistoryPage from "../pages/HistoryPage";

function AppRoutes({
  conversionHistory,
  onConversionComplete,
  onClearHistory,
}) {
  return (
    <Routes>
      <Route
        path="/"
        element={<ConverterPage onConversionComplete={onConversionComplete} />}
      />
      <Route
        path="/history"
        element={
          <HistoryPage
            history={conversionHistory}
            onClearHistory={onClearHistory}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
