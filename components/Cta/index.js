import React from "react";

export default function Button({ title, subtitle, button, button2, button3 }) {
  return (
    <div className="text-center flex flex-col p-2 sm:text-left sm:flex-row sm:items-center sm:justify-between sm:p-12 bg-primary-100 rounded-lg bg-purple-700">
      <div className="text-2xl font-semibold">
        <div className="text-white">{title}</div>
        <div className="text-gray-700">{subtitle}</div>
      </div>

      <div className="flex flex-col text-center text-2xl font-semibold items-center   sm:justify-end sm:items-end">
        <div className="whitespace-no-wrap mt-3 sm:mt-0 sm:ml-2  p-2 rounded-lg m-2">
          {button2}
        </div>
        <div className="whitespace-no-wrap mt-3 sm:mt-0 sm:ml-2  p-2 rounded-lg m-2">
          {button3}
        </div>
      </div>
    </div>
  );
}
