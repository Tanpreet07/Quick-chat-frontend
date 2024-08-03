import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import { useContext } from "react";
import { FriendsContext } from "./FriendsProvider";
import { AccountContext } from "./AccountProvider";
const Friendinfo = () => {
  const { setusers, currentuser, setshowchatbox } = useContext(FriendsContext);
  const { email } = useContext(AccountContext);

  const Deletechat = async () => {
    let res = await fetch("https://quick-chat-cqqi.onrender.com/deletechat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ femail: currentuser.friendemail, email: email }),
    });
    setusers(await res.json());
    setshowchatbox(false);
  };

  return (
    <Popover placement="top-start" showArrow={true}>
      <PopoverTrigger>
        <Button>
          <img src="./dots.png" width={25} height={25} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-[rgb(48,48,48)] shadow-md shadow-black text-white w-80 h-[300px]">
        <h3 className="w-full ms-2 font-bold">Contect info</h3>
        <div className="px-1 py-2 w-full flex flex-col items-center mt-2">
          <div>
            <img
              src={currentuser && currentuser.friendprofile}
              alt=""
              className="w-20 h-20 rounded-full"
            />
          </div>
          <h2 className="mt-4 font-bold text-[1.3rem]">
            {currentuser && currentuser.friendname}
          </h2>
          <p className="text-sm">{currentuser && currentuser.friendemail}</p>
          <br />
          <hr />
          <button
            className="text-red-600 mt-5 hover:bg-[rgb(65,65,65)] rounded-md px-2 py-1"
            onClick={Deletechat}
          >
            Delete contect
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Friendinfo;
