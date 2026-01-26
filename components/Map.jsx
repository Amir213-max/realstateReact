export default function Map({ latitude, longitude, address }) {
  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-gray-300">
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
        <svg
          className="w-24 h-24 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <p className="text-gray-600 text-lg font-semibold text-center px-4">
          {address || 'Map Location'}
        </p>
        {latitude && longitude && (
          <p className="text-gray-500 text-sm mt-2">
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </p>
        )}
      </div>
    </div>
  );
}
