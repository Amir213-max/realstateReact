import { lazy } from 'react';

/**
 * Wraps dynamic route imports so React.lazy never receives a module without a default component.
 * Avoids: "Lazy element type must resolve to a class or function" when default is missing or import fails.
 */
export function lazyPage(importer, debugName = 'page') {
  return lazy(() =>
    importer().then(
      (mod) => {
        if (mod && typeof mod.default === 'function') {
          return mod;
        }
        if (process.env.NODE_ENV !== 'production') {
          console.error(`[lazyPage] "${debugName}" missing default export`, mod);
        }
        return {
          default: function LazyPageMissingExport() {
            return (
              <div className="flex min-h-[50vh] flex-col items-center justify-center bg-bgSection px-4 text-center">
                <p className="text-lg font-semibold text-textPrimary">Page failed to load</p>
                <p className="mt-2 text-sm text-textSecondary">
                  {process.env.NODE_ENV !== 'production'
                    ? `Route "${debugName}" has no default export. Check the page module.`
                    : 'Please refresh the page or try again later.'}
                </p>
              </div>
            );
          },
        };
      },
      (err) => {
        if (process.env.NODE_ENV !== 'production') {
          console.error(`[lazyPage] "${debugName}" import failed`, err);
        }
        return {
          default: function LazyPageImportFailed() {
            return (
              <div className="flex min-h-[50vh] flex-col items-center justify-center bg-bgSection px-4 text-center">
                <p className="text-lg font-semibold text-textPrimary">Could not load this page</p>
                <p className="mt-2 text-sm text-textSecondary">Check your connection and refresh.</p>
              </div>
            );
          },
        };
      }
    )
  );
}
