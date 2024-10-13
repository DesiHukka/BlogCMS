import React from "react";

function NoDataMessage({ message }) {
  return (
    <div className="w-full px-4 py-2 rounded-xl bg-slate-200 text-center">
      {message}
    </div>
  );
}

export default NoDataMessage;
