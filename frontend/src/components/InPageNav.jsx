import { useEffect, useRef, useState } from "react";
export let activeBtn;
function InPageNav({ buttons, defaultHidden, children, activeCategory }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeUnderlineRef = useRef();
  const activeBtnRef = useRef();
  activeBtn = activeBtnRef.current;
  useEffect(() => {
    activeBtnRef.current.click();
  }, [activeCategory]);
  const handleButtonClick = (btn, i) => {
    setActiveIndex(i);
    activeUnderlineRef.current.style.width = btn.offsetWidth + "px";
    activeUnderlineRef.current.style.left = btn.offsetLeft + "px";
  };
  return (
    <>
      <div className="relative w-full px-4 border-b">
        {buttons.map((button, i) => {
          return (
            <button
              ref={i === activeIndex ? activeBtnRef : null}
              onClick={(e) => handleButtonClick(e.target, i)}
              key={i}
              className={`px-6 py-2 text-xl capitalize ${
                i === activeIndex
                  ? "text-black font-semibold"
                  : "text-gray-400 font-medium"
              } ${defaultHidden.includes(button) && "lg:hidden"}`}
            >
              {button}
            </button>
          );
        })}
        <hr
          ref={activeUnderlineRef}
          className="absolute bottom-0 border-black duration-300"
        />
      </div>
      <div className="">
        {Array.isArray(children) ? children[activeIndex] : children}
      </div>
    </>
  );
}

export default InPageNav;
