import className from "classnames";

export default function Button({ xl, children }) {
  const btnClass = className({
    btn: true,
    "btn-xl": xl,
    "btn-base": !xl,
    "btn-primary": true,
  });
  return (
    <div className={btnClass}>
      {children}

      <style jsx>
        {`
          .btn {
            @apply inline-block rounded-md text-center;
          }

          .btn-base {
            @apply text-lg font-semibold py-2 px-4;
          }

          .btn-xl {
            @apply font-extrabold text-xl py-4 px-6;
          }

          .btn-primary {
            @apply text-white bg-primary-500;
          }

          .btn-primary:hover {
            @apply bg-primary-600;
          }
        `}
      </style>
    </div>
  );
}
