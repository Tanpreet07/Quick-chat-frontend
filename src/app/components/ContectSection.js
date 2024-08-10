"use client"
import { React, useEffect } from 'react'
import { signOut } from "next-auth/react"
import { useState } from 'react';
import { Modal, ModalContent, ModalBody, Button, useDisclosure} from "@nextui-org/react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { useContext } from 'react';
import { AccountContext } from './AccountProvider';
import { FriendsContext } from './FriendsProvider';
import "./stylescroll.css";

const ContectSection = (props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { Username, email, profilepic } = useContext(AccountContext);
  const { users, setusers, setshowchatbox, currentuser, setcurrentuser, setfuid, setconversationid, search, setsearch, onlineUsers } = useContext(FriendsContext);
  const [friendemail, setfriendemail] = useState("");





  const findfriend = async (e) => {
    e.preventDefault();
    let res = await fetch("https://quick-chat-cqqi.onrender.com/findfriend", {
      method: "POST", headers: { "content-Type": "application/json" },
      body: JSON.stringify({ femail: friendemail, email: email }),
    });
    setusers(await res.json());
    setfriendemail("");
  }


  useEffect(() => {
    const getsocketid = async () => {
      if (currentuser) {
        let res = await fetch("https://quick-chat-cqqi.onrender.com/getsocketid", {
          method: "POST", headers: { "content-Type": "application/json" },
          body: JSON.stringify({ femail: currentuser.friendemail }),
        });
        setfuid(await res.json());
      }
    }
    getsocketid();
  }, [currentuser, users])


  useEffect(() => {
    const setconversation = async () => {
      if (currentuser) {
        let res = await fetch("https://quick-chat-cqqi.onrender.com/setconversation", {
          method: "POST", headers: { "content-Type": "application/json" },
          body: JSON.stringify({ sender: email, receiver: currentuser.friendemail }),
        });
        setconversationid(await res.json());
      }
    }
    setconversation();
  }, [currentuser])

  return (
    <div className={`w-[600px] flex flex-col items-center bg-[rgb(32,32,32)] text-white max-[450px]:w-screen max-[450px]:${props.show&&"hidden"}`}>
      <div className='w-full flex gap-1 mt-[2px]'>
        <img src="./chat.png" className='h-[22px] w-[25px] ms-2' />
        <p className='font-bold'>Quick chat</p>
      </div>
      <div className='mt-1 h-[84%] w-[360px] flex flex-col bg-[rgb(44,44,44)] border-[1px] border-black border-b-0 max-[450px]:w-screen'>
        <div className='h-[110px] w-full ms-1'>
          <p className='text-[1.3rem] font-bold mt-1 ms-[2px]'> Active Users </p>
          <div className=" w-[320px] flex gap-4 items-center p-1 overflow-x-auto no-scrollbar">
            {users && users.user.map((item, index) => (
              onlineUsers.includes(item.friendemail) &&
              <div key={index}>
                <img src={item.friendprofile} alt="" className='w-[50px] h-[50px] rounded-full' />
                <div className='w-4 h-4 bg-green-600 rounded-full relative bottom-4 left-8'></div>
              </div>
            ))}
          </div>
        </div>
        <div className='ms-4'>
          <form className='border-2 border-black flex w-[320px] rounded-[200px] overflow-hidden'>
            <div className='bg-[rgb(32,32,32)] w-8 flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="25px" height="25px">
                <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" fill='#fff' />
              </svg>
            </div>
            <input className='w-[290px] p-2 focus:outline-none bg-[rgb(32,32,32)]' type="text" name="searchfriend" id="searchfriend" placeholder='Search or start new chat' onChange={e => setsearch(e.target.value)} />
          </form>
        </div>
        <p className='font-bold text-[1.2rem] ms-5 mt-4'>ALL CHATS</p>
        <div className='ms-4 h-full overflow-y-auto no-scrollbar'>
          {users && users.user && users.user[0] == "you have no any friend" ? (<div className='text-center mt-[50%] text-2xl'>You Have Not Any Friend </div>) :
            (
              users && users.user.map((item, index) => (
                !search ? <button key={index} className='w-80 mt-2 border-2 border-black h-[75px] flex items-center rounded-xl hover:bg-[rgb(56,56,56)] max-[450px]:w-[90%]' onClick={() => { setshowchatbox(true), setcurrentuser(item), props.setshow(true) }}>
                  <img src={item.friendprofile} alt="" width={65} height={55} className='rounded-full ms-1' />
                  <p className='ms-2 font-bold'>{item.friendname}</p>
                </button> : item.friendname.includes(search) && <button key={index} className='w-80 mt-2 border-2 border-black h-[75px] flex items-center rounded-xl hover:bg-[rgb(56,56,56)] max-[450px]:w-[90%]' onClick={() => { setshowchatbox(true), setcurrentuser(item), props.setshow(true) }}>
                  <img src={item.friendprofile} alt="" width={65} height={55} className='rounded-full ms-1' />
                  <p className='ms-2 font-bold'>{item.friendname}</p>
                </button>
              ))
            )}
        </div>
      </div>
      <div className='bg-[rgb(32,32,32)] border-[1px] border-black border-t-0 w-[360px] h-20 max-[450px]:w-screen'>
        <div className="flex items-center mt-2">
          <Popover placement="top-start" showArrow={true}>
            <PopoverTrigger className='w-[230px] h-[50px] ms-1'>
              <Button>
                <img src={profilepic} alt="" width={50} height={30} className='me-1 rounded-full' />
                <div className='text-start me-4'>
                  <p className='text-[12px] font-bold'>{Username}</p>
                  <p className='text-[10px]'>{email}</p>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className='bg-[rgb(48,48,48)] text-white w-80 h-[350px] border-[1px] border-black rounded-t-xl shadow-md shadow-black'>
              <div className="px-1 py-2 w-full">
                <div>
                  <img src={profilepic} alt="" className='w-20 h-20 rounded-full' />
                </div>
                <h2 className='mt-4 font-bold text-[1.3rem]'>{Username}</h2>
                <p className='text-sm'><b>Email: </b>{email}</p>
                <br />
                <hr />
                <button className='text-red-600 border-[1px] border-white rounded-lg mt-5 hover:bg-[rgb(65,65,65)] px-2 py-1' onClick={() => { signOut() }}>Sign Out</button>
                <p className='text-[12px] ms-2 mt-3'>Chat history on this computer will not be cleared when you sign out.</p>
              </div>
            </PopoverContent>
          </Popover>
          <div>
          </div>
          <Button onPress={onOpen} className='ms-8 bg-green-500 text-white rounded-xl'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="adduser">
              <path d="M416 153h-25v-25h-14v25h-25v14h25v25h14v-25h25zM202.4 201.7zM363.3 363.9c-12.9-4.6-31.4-6.2-43.2-8.8-6.8-1.5-16.7-5.3-20-9.2-3.3-4-1.3-40.9-1.3-40.9s6.1-9.6 9.4-18c3.3-8.4 6.9-31.4 6.9-31.4s6.8 0 9.2-11.9c2.6-13 6.6-18.4 6.1-28.1-.5-9-5.2-9.5-5.7-9.5s4.9-13.6 5.6-42.4C331.1 129.6 305 96 256 96s-75 33.5-74.3 67.6c.6 28.7 5.6 42.4 5.6 42.4-.5 0-5.2.5-5.7 9.5-.5 9.7 3.6 14.9 6.1 27.9 2.4 11.9 9.2 12 9.2 12s3.6 23.1 6.9 31.5c3.3 8.5 9.4 18 9.4 18s2 36.9-1.3 40.9-13.2 7.7-20 9.2c-11.9 2.6-30.3 4.3-43.2 8.9C135.8 368.5 96 384 96 416h320c0-32-39.8-47.5-52.7-52.1zM256 400H118.7c2-3 4.7-5.1 8.2-7.6 7-5.1 16.1-9.8 27.1-13.6 6.8-2.4 16.7-4 25.4-5.3 5.7-.9 11.1-1.7 15.9-2.8 3.4-.8 20.8-5 28.8-14.6 4.5-5.4 5.8-12.7 5.6-32.3-.1-10-.6-19.3-.6-19.7l-.2-4.2-2.3-3.5c-1.5-2.3-5.8-9.5-8-15.3-1.8-4.7-4.6-19.2-6-28.1 0 0 .4 1-.5-3.7s-8.4-4.3-9.4-8c-.9-3.6-1.8-6.9-4.3-18.2-2.5-11.3 2.8-11.2 3.9-16.2.6-3.1 0-5.7 0-5.8-.3-1-4.1-13.4-4.7-37.7-.3-13.2 4.6-25.6 13.8-34.9 10.6-10.8 26-16.5 44.5-16.5 19 0 34 5.7 44.6 16.5 9.2 9.3 14.1 21.7 13.8 34.9-.5 24.2-4.3 36.6-4.7 37.7 0 .1-.6 1.7-.4 5.2.2 5.4 6.8 5.5 4.3 16.8s-3.4 14.6-4.3 18.2c-.9 3.6-8.5 3.3-9.4 8s-.5 3.7-.5 3.7c-1.4 8.9-4.2 23.4-6 28.1-2.3 5.8-6.6 13-8 15.3l-2.3 3.5-.2 4.2c0 .4-.5 9.7-.6 19.7-.2 19.6 1.1 26.9 5.6 32.3 8 9.5 25.4 13.8 28.8 14.6 4.8 1.1 10.2 1.9 15.9 2.8 8.7 1.3 18.6 2.9 25.4 5.3 11 3.9 20.2 8.6 27.1 13.7 3.5 2.5 6.2 4.6 8.2 7.6H256z" fill="#ffffff" className="color000000 svgShape"></path>
            </svg>
          </Button>
          <Modal className='bg-[rgb(48,48,48)] shadow-md shadow-black text-white py-10 max-[450px]:my-auto' isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalBody className='flex flex-col items-center'>
                    <h1 className='text-3xl font-bold mt-3'>Add Your Friend...</h1>
                    <div className='w-full flex flex-col items-center'>
                      <form className='flex flex-col items-center mt-3 w-full' onSubmit={findfriend}>
                        <label htmlFor="friend"> Enter Email:</label>
                        <input type="text" name="friend" id="friend" placeholder="Enter Your Friend's Email" required className='my-2 bg-[rgb(32,32,32)] p-2 w-[90%] rounded-xl border-[1px] border-black' value={friendemail} onChange={e => setfriendemail(e.target.value)} />
                        <input type="submit" value={"Add"} className='bg-gray-400 w-[70px] mx-auto p-2 text-center rounded-lg' />
                      </form>
                    </div>
                    <div>{users.success}</div>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default ContectSection
