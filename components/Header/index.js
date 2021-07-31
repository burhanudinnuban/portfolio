import React from "react";

export default function Header() {
  function openInNewTab(url) {
    var win = window.open(url, "_blank");
    win.focus();
  }

  // %20 mean space in link
  // If you already had an array then you just join them with '%20'
  // easy right

  function getLinkWhastapp() {
    var number = "+6282118992254";
    var message = "Halo Burhan, are you open oppurtunity now?"
      .split(" ")
      .join("%20");
    openInNewTab(
      `https://api.whatsapp.com/send?phone=${number}&text=%20${message}`
    );
  }
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div>
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8"></div>
          </div>

          <main className="mt-2 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-10">
            <div className="sm:text-center lg:text-left">
              <figure className="md:flex  rounded-xl p-8 md:p-0">
                <img
                  className="w-32 h-32 md:w-48 md:h-auto md:rounded-2xl rounded-full mx-auto"
                  src="/bg-blue-photo.png"
                  alt=""
                />
                <div className="pt-6 md:p-8 text-center md:text-left space-y-4">
                  <blockquote>
                    <p className="text-lg font-semibold">
                      “I'm 23 years old and i'm an Fullstack Developer. I have
                      expertise in some technology : React Native, React JS,
                      Next JS, Express JS, Swift 5, Android Studio. And also in
                      Design Graphics with Adobe Ilustrator..”
                    </p>
                  </blockquote>
                  <figcaption className="font-medium">
                    <div className="text-purple-600 text-base">
                      Burhanudin Nuban
                    </div>
                    <div className="text-gray-500">
                      Mobile Developer, Jakarta
                    </div>
                  </figcaption>
                </div>
              </figure>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <button
                    onClick={() =>
                      openInNewTab(
                        `mailto:burhanudinnuban@gmail.com?subject=NewJobs!&body=Halo Burhan, are you open oppurtunity now?.`
                      )
                    }
                    href="#"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                  >
                    Send Mail
                  </button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button
                    onClick={getLinkWhastapp}
                    href="#"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                  >
                    Send Whatsapp
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="./bg-header.jpg"
          alt=""
        />
      </div>
    </div>
  );
}
