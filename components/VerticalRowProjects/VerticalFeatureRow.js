import className from "classnames";
import { useRouter } from "next/router";

export default function VerticalFeatureRow({
  title,
  description,
  description2,
  description3,
  linkAndroid,
  linkIOS,
  link,
  image,
  imageAlt,
  reverse,
}) {
  const router = useRouter();
  const verticalFeatureClass = className(
    "mt-5",
    "flex",
    "flex-wrap",
    "items-center",
    {
      "flex-row-reverse": reverse,
    },
    "rounded-xl",
    "border-4",
    "p-8"
  );

  function openInNewTab(url) {
    var win = window.open(url, "_blank");
    win.focus();
  }
  return (
    <div className={verticalFeatureClass}>
      <div className="w-full sm:w-1/2 text-center sm:px-6">
        <div className="text-xl text-blue-800 font-extrabold">
          <button onClick={() => openInNewTab(link)}>{title}</button>
        </div>
        <div className="mt-2 text-sm leading-9">{description}</div>
        <div className="mt-2 text-white text-sm leading-9 bg-gray-600 rounded">
          {description2}
        </div>
        <div className="mt-2 text-black text-sm leading-9">{description3}</div>

        <div className="flex flex-row justify-around">
          {linkAndroid && (
            <div className="mt-2  text-purple-700 text-xs leading-9">
              <button onClick={() => openInNewTab(linkAndroid)}>
                <img className="w-10 h-10" src="/playstore.png" />
              </button>
            </div>
          )}
          {linkIOS && (
            <div className="mt-2 text-purple-700 text-xs leading-9">
              <button onClick={() => openInNewTab(linkIOS)}>
                <img className="w-10 h-10" src="/app-store.png" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="w-full sm:w-1/2 ">
        <img
          className="rounded-lg"
          src={`${router.basePath}${image}`}
          alt={imageAlt}
        />
      </div>
    </div>
  );
}
