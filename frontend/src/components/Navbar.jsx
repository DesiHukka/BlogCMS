import { ImLeaf } from "react-icons/im";
import { FiSearch } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";
import { useContext, useState, useRef, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { FaRegBell } from "react-icons/fa6";
import UserNav from "./UserNav";
import { toast } from "react-toastify";

function Navbar() {
  const [toggleSearch, setToggleSearch] = useState(false);
  const [toggleUserNav, setToggleUserNav] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    user: { accessToken, pic },
  } = useContext(UserContext);

  const userNavRef = useRef();
  const searchRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    const handleEvent = (e) => {
      if (!userNavRef.current?.contains(e.target)) {
        setToggleUserNav(false);
      }

      if (!searchRef.current?.contains(e.target)) {
        setToggleSearch(false);
      }
    };
    document.addEventListener("click", handleEvent, true);
    return () => {
      document.removeEventListener("click", handleEvent);
    };
  }, []);

  const handleSearch = () => {
    if (searchQuery.length < 3) {
      toast.error("Enter atleast 3 characters to Search!!!");
    } else navigate(`/search/${searchQuery}`);
  };

  return (
    <>
      <div className="relative flex items-center min-h-28 px-8 py-4 md:p-1 md:px-4 border-b-4 z-50">
        <div className="flex flex-1 lg:px-8 justify-between items-center gap-6">
          <div className="mr-8 md:ml-6">
            <Link to={"/"}>
              <ImLeaf className="text-3xl" />
            </Link>
          </div>
          <div ref={searchRef} className="flex-1">
            <div
              onClick={() => setToggleSearch((currVal) => !currVal)}
              className="ml-auto flex w-12 h-12 justify-center items-center rounded-full bg-gray-100 hover:bg-gray-200 md:hidden"
            >
              <FiSearch className="text-2xl" />
            </div>

            <div
              className={`w-5/6 bg-white md:flex-1 md:border-0 md:flex md:inset-0 p-2 m-2 md:m-0 absolute md:relative top-full left-4 placeholder:text-xs  ${
                toggleSearch ? "flex" : "hidden"
              }`}
            >
              <input
                className="peer w-full h-[70px] p-4 md:py-2 md:px-6 border-2 border-gray-400 outline-none focus:border-purple-800 rounded-full rounded-r-none bg-gray-100"
                type="search"
                name="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="peer-focus:border-purple-800 border-2 py-4 px-6 flex-1 flex border-gray-400 hover:text-purple-500 justify-center items-center rounded-full rounded-l-none -mx-1"
              >
                <FiSearch className="text-2xl" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 lg:gap-8 md:flex-1 justify-end">
            <Link to={"/editor"} className="flex gap-2 items-center">
              <FiEdit className="text-2xl" />
              <span className="text-sm">Write</span>
            </Link>

            {!accessToken ? (
              <>
                <div className="hidden md:block min-w-fit">
                  <Link
                    to={"/sign-in"}
                    className="bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-xl"
                  >
                    Sign In
                  </Link>
                </div>
                <div className="min-w-fit">
                  <Link
                    to={"/sign-up"}
                    className="bg-black hover:bg-gray-700 text-white px-4 py-2 rounded-xl"
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 flex justify-center items-center rounded-full bg-gray-100 hover:bg-gray-200 ">
                  <FaRegBell className="text-2xl " />
                </div>
                <div ref={userNavRef} className="">
                  <div
                    onClick={() => setToggleUserNav((curr) => !curr)}
                    className="w-12 h-12 bg-gray-100 rounded-full flex justify-center items-center overflow-hidden"
                  >
                    <img
                      src={pic}
                      className="object-cover aspect-square rounded-full"
                    />
                  </div>

                  {toggleUserNav && (
                    <div className="absolute top-full right-0">
                      <UserNav />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default Navbar;
