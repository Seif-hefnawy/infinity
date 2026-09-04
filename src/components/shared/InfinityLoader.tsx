interface InfinityLoaderProps {
  /** Use page only when no page content can render before data/auth is ready. */
  variant?: "section" | "page";
  label?: string;
  className?: string;
}

/** An in-flow status, never an overlay. The containing page owns its content. */
export default function InfinityLoader({
  variant = "section",
  label = "Loading...",
  className = "",
}: InfinityLoaderProps) {
  return (
    <div
      className={`loader-container loader-container--${variant} ${className}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="loader-indicator">
        <div className="loader-motion" aria-hidden="true">
          <span className="loader-pendulum" />
        </div>
        <p className={variant === "page" ? "sr-only" : "font-body text-ruby/60 text-sm text-center"}>
          {label}
        </p>
      </div>
    </div>
  );
}
