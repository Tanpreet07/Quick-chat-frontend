import React, { useState } from 'react'
import { useContext, useMemo, useEffect, useRef } from 'react'
import { FriendsContext } from './FriendsProvider'
import { AccountContext } from './AccountProvider';
import { io } from "socket.io-client";
import Friendinfo from './Friendinfo';
const Chatbox = (props) => {
  const { showchatbox, currentuser, setuid, fuid, conversationid, onlineUsers, setOnlineUsers } = useContext(FriendsContext);
  const { email } = useContext(AccountContext);
  const socket = useMemo(() => io("https://quick-chat-cqqi.onrender.com", {
    query: { email: email }
  }), [email]);
  const [messages, setmessages] = useState([]);
  const [sender, setsender] = useState("");
  const [data, setdata] = useState();
  const [file, setfile] = useState(null);
  const [receive, setreceive] = useState();


  const messagesEndRef = useRef(null);



  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
    }
  };


  useEffect(() => {
    socket.on("connect", () => {
      setuid(socket.id);
    });


    socket.on('online-users', (users) => {
      setOnlineUsers(users);
    });

    socket.on("welcome", (data) => {
    });
    socket.on("receive-msg", (data) => {
      let messages = data.messages;
      let id = data.id;
      let cid = data.cid;
      let type = data.type;
      let time = data.time;
      setsender(cid);
      setreceive({ messages: messages, id: id, time: time, type: type });
    });

    return () => {
      socket.off('online-users');
    };

  }, []);


  const getTime = () => {
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`
  }



  useEffect(() => {
    scrollToBottom();
  },);




  const submithandler = async (e) => {
    e.preventDefault();
    const time = getTime();

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      let res = await fetch("https://quick-chat-cqqi.onrender.com/upload", {
        method: "POST",
        body: formData
      });

      let fileData = await res.json();
      const fileUrl = `https://quick-chat-cqqi.onrender.com/files/${fileData.originalname}`;

      socket.emit("message", { messages: fileUrl, id: fuid.id, cid: conversationid.id, type: file.type, time: time });

      let data = {
        messages: fileUrl,
        id: email,
        time: time,
        type: file.type
      }
      await fetch("https://quick-chat-cqqi.onrender.com/setmessages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: conversationid.id, messages: data })
      });

      setfile(null);
    } else {
      if (messages && messages != "") {
        socket.emit("message", { messages: messages, id: fuid.id, cid: conversationid.id, type: "txt", time: time });

        let data = {
          messages: messages,
          id: email,
          time: time,
          type: "txt"
        }
        await fetch("https://quick-chat-cqqi.onrender.com/setmessages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: conversationid.id, messages: data })
        });
      }
    }

    setmessages("");
    setreceive("");
  }



  useEffect(() => {
    if (file) {
      setmessages(file.name);
    }
  }, [file])




  useEffect(() => {

    const getmessages = async () => {
      let res = await fetch("https://quick-chat-cqqi.onrender.com/getmessages", {
        method: "POST", headers: { "content-Type": "application/json" },
        body: JSON.stringify({ id: conversationid.id }),
      });
      setdata(await res.json());
    }
    getmessages();

  }, [conversationid, receive, messages])





  const downloadfile = async (e, message) => {
    e.preventDefault();
    const name = message.split('files/')[1];
    const fileUrl = `https://quick-chat-cqqi.onrender.com/files/${name}`;
    let res = await fetch(fileUrl);
    let blob = await res.blob();

    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a link element and click it to trigger the download
    const a = document.createElement('a');
    a.style.display = "none";
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }



  return (
    <div className={`bg-[rgb(44,44,44)] h-full w-full max-[450px]:${!props.show?"hidden":"inline-block"} max-[450px]:z-10`}>
      {!showchatbox ? <div className='bg-[rgb(44,44,44)] text-white h-full flex items-center justify-center max-[450px]:hidden'>
        <div className='flex flex-col items-center'>
          <img src="./chat.png" width={70} height={70} />
          <h2 className='text-[1.5rem] font-extrabold mt-1'>Hi! welcome to the Quick chat</h2>
          <p>Send and receive messages without keeping your phone online</p>
        </div>
      </div> :
        <div className='h-full w-full'>
          <div className='h-[70px] bg-[rgb(44,44,44)] flex justify-between items-center text-white'>
            <div className=' w-[400px] h-full flex gap-1 items-center text-white'>
              < button className='ms-2 hidden max-[450px]:inline-block' onClick={()=>{props.setshow(false)}}>
                <img src="./back.png" className='w-[20px] h-[15px]' />
              </button>
              <img src={currentuser && currentuser.friendprofile} alt="" className='rounded-full h-[60px] ms-3' />
              <div className='h-full ms-1 flex flex-col justify-center'>
                <p>{currentuser && currentuser.friendname}</p>
                <p className='text-[12px] text-gray-500'>{onlineUsers.includes(currentuser.friendemail) ? "Online" : "Offline"}</p>
              </div>
            </div>
            <div className='mr-4'>
              <Friendinfo setreceive={setreceive} />
            </div>
          </div>
          <div className='overflow-y-auto h-[81%] no-scrollbar bg-[url(/bg1.jpg)]'>
            {data && data.messages && data.messages.map((item, index) => (
              item && email == item.id ?
                <div key={index} className='bg-green-600 text-white max-w-xl w-fit mt-1 ms-auto break-words mb-2 px-2 pt-2 rounded-xl flex flex-col me-3'>
                  {(item.type && item.type.startsWith('image/')) ?
                    <img src={item.messages} alt="" width={200} height={200} className='rounded-lg'/> :
                    item.type && item.type.startsWith('text/') ? <iframe src={item.messages} title="Received File" width="400px" height="200px" className='rounded-lg' /> :
                      item.type && item.type.startsWith('video/') ? <video src={item.messages} controls className='w-[250px] h-[300px] rounded-lg'></video> :
                        item.type && item.type == 'txt' && <p>{item.messages}</p>}
                  <div className={`flex justify-end gap-1 ${item.type && item.type != "txt" && "relative bottom-5 right-3 text-white h-1"}`}>
                    {item.type && item.type != 'txt' && <button className='h-20 relative bottom-8' onClick={(e) => { downloadfile(e, item.messages) }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" id="Download" height={20} width={20}>
                        <path d="M38 18h-8V6H18v12h-8l14 14 14-14zM10 36v4h28v-4H10z" fill="#ffffff" className="color000000 svgShape"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                    </button>}
                    <p className='text-[9px] h-4'>{item.time}</p>
                  </div>
                  {item.type && item.type != 'txt' && item.type.startsWith('text/') && <p className=''>{item.messages.split('files/')[1]}</p>}
                </div> :
                <div key={index} className='bg-slate-400 text-white ms-2 max-w-xl w-fit mt-1 break-words mb-2 px-2 pt-2 rounded-xl flex flex-col gap-1'>
                  {(item.type && item.type.startsWith('image/')) ?
                    <img src={item.messages} alt="" width={200} height={200} className='rounded-lg' /> :
                    item.type && item.type.startsWith('text/') ? <iframe src={item.messages} title="Received File" width="400px" height="200px" className='rounded-lg' /> :
                      item.type && item.type.startsWith('video/') ? <video src={item.messages} controls className='w-[250px] h-[300px] rounded-lg'></video> :
                        item.type && item.type == 'txt' && <p>{item.messages}</p>}
                  <div className={`flex justify-end gap-1 ${item.type && item.type != "txt" && "relative bottom-5 right-3 text-white h-1"}`}>
                    {item.type && item.type != 'txt' && <button className='h-20 relative bottom-8' onClick={(e) => { downloadfile(e, item.messages) }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" id="Download" height={20} width={20}>
                        <path d="M38 18h-8V6H18v12h-8l14 14 14-14zM10 36v4h28v-4H10z" fill="#ffffff" className="color000000 svgShape"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                    </button>}
                    <p className='text-[9px] h-4'>{item.time}</p>
                  </div>
                  {item.type && item.type != 'txt' && item.type.startsWith('text/') && <p className=''>{item.messages.split('files/')[1]}</p>}
                </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className='bg-[rgb(44,44,44)] h-[70px] absolute bottom-1 w-[71.5%] max-[450px]:w-[100%] bt'>
            <div className='flex h-full gap-4  items-center text-white max-[450px]:w-[100%]'>
              <label className='ms-4' htmlFor='file'>
                <img src='paperclip-icon.png' className='h-[22px] w-[22px]' />
              </label>
              <input type="file" name='file' id='file' className='hidden' onChange={e => setfile(e.target.files[0])} />
              <form className='w-full flex items-center gap-6 max-[450px]:w-[380px] max-[450px]:gap-2'>
                <input className='w-[90%] p-1 rounded-xl focus:outline-none bg-[rgb(32,32,32)] max-[450px]:py-2 max-[450px]:w-[80%]' type="text" name="send" id="send" value={messages} onChange={e => setmessages(e.target.value)} placeholder='Type a message' required />
                <button onClick={submithandler} className='bg-green-500 p-2 rounded-full flex justify-center items-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" id="Send1" height={25} width={25}>
                    <defs><clipPath id="a"><rect width="64" height="64" fill="#ffffff" className="color000000 svgShape"></rect></clipPath></defs>
                    <g fill="#ffffff" className="color000000 svgShape"><path d=" M 8.216 36.338 L 26.885 32.604 C 28.552 32.271 28.552 31.729 26.885 31.396 L 8.216 27.662 C 7.104 27.44 6.021 26.356 5.799 25.245 L 2.065 6.576 C 1.731 4.908 2.714 4.133 4.259 4.846 L 61.228 31.139 C 62.257 31.614 62.257 32.386 61.228 32.861 L 4.259 59.154 C 2.714 59.867 1.731 59.092 2.065 57.424 L 5.799 38.755 C 6.021 37.644 7.104 36.56 8.216 36.338 Z " fill="#ffffff" className="color000000 svgShape"></path></g>
                  </svg>
                </button>
              </form>
            </div>

          </div>
        </div>
      }
    </div>
  )
}

export default Chatbox
