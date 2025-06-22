import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/Slices/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { RiMessengerLine } from "react-icons/ri"; // Remix Icon
import { MessageCircle } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { toast } from "sonner";
import { setMessages } from "@/redux/Slices/chatSlice";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${receiverId}`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        console.log("messages in redux:", messages);
        setMessage("");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const followingUsers = suggestedUsers.filter((u) =>
    user.following.includes(u._id)
  );
  return (
    <div className="flex ml-[16%] h-screen">
      <section className="w-full md:w-1/4 border-r border-r-gray-300">
        <h1 className="font-bold px-7 py-3.5 text-xl ">{user?.userName}</h1>
        <hr className="mb-4 border-gray-30" />
        <div className="overflow-y-auto h-[80vh]">
          {followingUsers.map((followingUser) => {
            const isOnline = onlineUsers.includes(followingUser?._id);
            return (
              <div
                onClick={() => dispatch(setSelectedUser(followingUser))}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <Avatar>
                  <AvatarImage src={followingUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{followingUser?.userName}</span>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedUser ? (
        <section className="flex-1  flex flex-col h-full">
          <div className="flex gap-3 items-center px-3 py-3 border-b border-gray-300 sticky top-0 bg-white z-index-10">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser?.userName}</span>
            </div>
          </div>

          <Messages selectedUser={selectedUser} />

          <div className="flex items-center justify-end  p-5 pb-8 border-t border-t-gray-300">
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Message..."
            />
            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto text-center mt-10 ">
          <div className="relative w-32 h-32 my-4">
            <MessageCircle className="w-full h-full stroke-[1]" />
            <RiMessengerLine className="absolute inset-0 m-auto w-15 h-15" />
          </div>
          <h1 className="font-semibold text-lg">Your Messages</h1>
          <span className="text-gray-600">Send a message to start a chat.</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
