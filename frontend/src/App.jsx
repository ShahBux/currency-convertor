import { NavLink } from "react-router-dom";
import { useConversionHistory } from "./hooks/useConversionHistory";
import { useTheme } from "./hooks/useTheme";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  const { theme, toggleTheme } = useTheme();
  const { conversionHistory, addConversion, clearConversionHistory } =
    useConversionHistory();

  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink to="/" className="brand" aria-label="FlowConvert home">
          <span className="brand-mark">FC</span>
          <span>FlowConvert</span>
        </NavLink>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" end>
            Converter
          </NavLink>
          <NavLink to="/history">
            History{" "}
            <span className="history-count">{conversionHistory.length}</span>
          </NavLink>
        </nav>

        <button className="theme-toggle" type="button" onClick={toggleTheme}>
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
      </header>

      <main className="main-content">
        <AppRoutes
          conversionHistory={conversionHistory}
          onConversionComplete={addConversion}
          onClearHistory={clearConversionHistory}
        />
      </main>

      <footer>Secure exchange rates, supplied through the server.</footer>
    </div>
  );
}

export default App;
