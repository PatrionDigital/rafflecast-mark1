import { useRouteError } from "react-router-dom";

const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <div className="error-container">
      <h2>Oops! Something went wrong</h2>
      <p>{error?.message || "An unexpected error occurred"}</p>
      {error?.stack && process.env.NODE_ENV === "development" && (
        <pre className="error-stack">{error.stack}</pre>
      )}
    </div>
  );
};

export default ErrorBoundary;
