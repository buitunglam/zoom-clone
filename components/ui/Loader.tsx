import Image from "next/image";
import React from "react";

const Loader = () => {
  return (
    <div className="flex-center h-screen w-full absolute top-0 left-0">
      <Image
        src="/icons/loading-circle.svg"
        alt="loaded"
        width={50}
        height={50}
      />
    </div>
  );
};

export default Loader;
