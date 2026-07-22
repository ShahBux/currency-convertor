import { useState } from "react";
import {
  clearStoredHistory,
  getStoredHistory,
  saveConversionToHistory,
} from "../services/conversionHistoryService";
export function useConversionHistory() {
  const [conversionHistory, setConversionHistory] = useState(getStoredHistory);

  function addConversion(conversion) {
    setConversionHistory(saveConversionToHistory(conversion));
  }

  function clearConversionHistory() {
    clearStoredHistory();
    setConversionHistory([]);
  }

  return { conversionHistory, addConversion, clearConversionHistory };
}
