export function ErrorMessage({ message, onDismiss }) {
  if (!message) return null

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl border border-red-200/90 bg-red-50/95 px-4 py-3 text-sm text-red-900 shadow-md shadow-red-100/80 backdrop-blur-sm dark:border-red-900/50 dark:bg-red-950/80 dark:text-red-100"
    >
      <span className="mt-0.5 text-red-500 dark:text-red-400" aria-hidden>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </span>
      <p className="min-w-0 flex-1 leading-relaxed">{message}</p>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-lg bg-red-600/10 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-600/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 dark:text-red-200"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-lg p-1 text-red-600 transition hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 dark:text-red-300 dark:hover:bg-red-900/50"
          aria-label="Dismiss error"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
