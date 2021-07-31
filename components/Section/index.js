export default function Section({ title, description, yPadding, children }) {
  return (
    <div
      className={`max-w-screen-lg mx-auto px-3 ${
        yPadding ? yPadding : "py-16"
      }`}
    >
      {(title || description) && (
        <div className="mb-12 text-center">
          {title && (
            <h2 className="text-4xl text-gray-900 font-bold">{title}</h2>
          )}
          {description && (
            <div className="mt-4 text-xl md:px-20">{description}</div>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
