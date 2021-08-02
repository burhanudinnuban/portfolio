import React from "react";
import CTABanner from "../Cta";
import Section from "../Section";

export default function Banner() {
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
    <Section>
      <CTABanner
        title="Do you want your company to grow exponentially?"
        subtitle="Contact me now"
        button2={
          <button
            onClick={getLinkWhastapp}
            className={"flex row-auto justify-center items-center"}
          >
            <a className={"text-sm m-2 text-white"}>+62-8211-8992-254</a>
            <img className="w-10 h-10" src={"./whatsapp.png"} />
          </button>
        }
        button3={
          <button
            onClick={() =>
              openInNewTab(
                `mailto:burhanudinnuban@gmail.com?subject=NewJobs!&body=Halo Burhan, are you open oppurtunity now?.`
              )
            }
            className={"flex row-auto justify-center items-center"}
          >
            <a className={"text-sm m-2 text-white"}>
              burhanudinnuban@gmail.com
            </a>
            <img className="w-10 h-10" src={"./gmail.png"} />
          </button>
        }
      />
    </Section>
  );
}
