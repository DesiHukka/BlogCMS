import { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { GrUserSettings } from "react-icons/gr";
import { TbUserEdit } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa6";
import { LuLayoutDashboard } from "react-icons/lu";
import { UserContext } from "../App";
import { removeFromSession } from "../utils/sessionStorage";

function UserNav() {
  const {
    user: { id, userName },
    setUser,
  } = useContext(UserContext);

  return (
    <div className="min-w-52 flex flex-col border-2 mr-2 bg-white">
      <Link
        to={`/user/${id}`}
        className="pl-8 p-4 hover:bg-gray-100 flex gap-2 items-center"
      >
        <FaRegUser className="text-2xl" />
        Profile
      </Link>
      <hr />
      <Link className="pl-8 p-4 hover:bg-gray-100 flex gap-2 items-center">
        <LuLayoutDashboard className="text-2xl" />
        Dashboard
      </Link>
      <hr />
      <Link
        to={"/editor"}
        className="pl-8 p-4 hover:bg-gray-100 flex gap-2 items-center"
      >
        <TbUserEdit className="text-2xl" />
        Write
      </Link>
      <hr />
      <Link className="pl-8 p-4 hover:bg-gray-100 flex gap-2 items-center">
        <GrUserSettings className="text-2xl" />
        Settings
      </Link>
      <hr />
      <button
        onClick={() => {
          removeFromSession("user");
          setUser({ accessToken: null });
        }}
        className="px-8 py-4 hover:bg-gray-100 "
      >
        <h3 className="font-semibold">Sign Out</h3>
        <p className="text-sm">@{userName}</p>
      </button>
    </div>
  );
}

export default UserNav;
