import React from "react";
import { Link } from "react-router-dom";

function UserCard({ user }) {
  const { fullName, userName, pic, _id } = user;

  return (
    <section>
      <Link
        to={`/user/${_id}`}
        className="flex gap-8 p-2 bg-white hover:bg-slate-200 w-max rounded-md"
      >
        <div className="w-20 aspect-square rounded-sm bg-slate-100 overflow-hidden">
          <img className="w-20 aspect-square object-cover" src={pic} alt="" />
        </div>
        <div className="flex flex-col gap-2 mr-4">
          <h2>{fullName}</h2>
          <h3>@{userName}</h3>
        </div>
      </Link>
    </section>
  );
}

export default UserCard;
