export default function Map({ latitude, longitude, address }) {
  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gradient-to-br from-bgSection to-borderColor-strong border-2 border-borderColor-strong">
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-bgSection">
        <svg
          className="w-24 h-24 text-textSecondary mb-4"
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
        <p className="text-textSecondary text-lg font-semibold text-center px-4">
          {address || 'Map Location'}
        </p>
        {latitude != null && longitude != null && (
          <p className="text-textSecondary text-sm mt-2">
            {Number(latitude).toFixed(4)}, {Number(longitude).toFixed(4)}
          </p>
        )}
      </div>
    </div>
  );
}
