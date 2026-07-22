import "./pages.css";

function formatCurrencyAmount(value) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(
    value,
  );
}

function HistoryPage({ history, onClearHistory }) {
  if (history.length === 0) {
    return (
      <section className="history-page">
        <div className="history-heading">
          <div>
            <span className="eyebrow">YOUR ACTIVITY</span>
            <h1>Conversion history</h1>
            <p>Saved on this device, even after a refresh.</p>
          </div>
        </div>
        <div className="empty-state">
          <div>History</div>
          <h2>No conversions yet</h2>
          <p>
            Your completed conversions will appear here with their exact date
            and time.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="history-page">
      <div className="history-heading">
        <div>
          <span className="eyebrow">YOUR ACTIVITY</span>
          <h1>Conversion history</h1>
          <p>Saved on this device, even after a refresh.</p>
        </div>
        <button className="clear-button" onClick={onClearHistory}>
          Clear history
        </button>
      </div>
      <div className="history-list">
        {history.map((conversion) => (
          <article className="history-item" key={conversion.id}>
            <div className="history-icon">
              {conversion.from[0]}-{conversion.to[0]}
            </div>
            <div className="history-main">
              <strong>
                {formatCurrencyAmount(conversion.amount)} {conversion.from} to{" "}
                {formatCurrencyAmount(conversion.convertedAmount)}{" "}
                {conversion.to}
              </strong>
              <p>
                1 {conversion.from} = {formatCurrencyAmount(conversion.rate)}{" "}
                {conversion.to}
                {conversion.date && " (historical rate)"}
              </p>
            </div>
            <time dateTime={conversion.createdAt}>
              {new Date(conversion.createdAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </time>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HistoryPage;
