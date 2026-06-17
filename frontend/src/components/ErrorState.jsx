export default function ErrorState({ message, onRetry }) {
  return (
    <div className="app-state error">
      <p>{message}</p>
      {onRetry ? (
        <button type="button" className="app-state-retry" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
