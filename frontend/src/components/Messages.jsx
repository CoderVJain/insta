import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import useGetAllMessages from "@/hooks/useGetallMessages";
import useGetRTM from "@/hooks/useGetRTM";

const Messages = ({ selectedUser}) => {
  useGetRTM();
  useGetAllMessages();
  const {messages} = useSelector(store => store.chat);
  const {user}= useSelector(store => store.auth);
  
  return (
    <div className="overflow-y-auto flex-1 p-4 ">
      <div className="flex justify-center">
        <section className="flex flex-col items-center justify-center text-center text-white mt-10">
          <Avatar className="w-15 h-15 ">
            <AvatarImage
              src={selectedUser?.profilePicture}
              alt="User Avatar"
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-700 text-white">
              CN
            </AvatarFallback>
          </Avatar>

          <h2 className="text-lg font-bold text-black">
            {selectedUser?.userName}
          </h2>
          <p className="text-gray-400 mb-3">
            {selectedUser?.userName} · Instagram
          </p>

          <Button variant='secondary' className="text-center rounded-l-lg rounded-r-lg bg-gray-600 hover:bg-gray-500 text-white font-medium px-3 py-1 mb-3">
            <Link to={`/profile/${selectedUser._id}`}><span className="text-center text-sm">View profile</span></Link>
          </Button>

          <p className="text-gray-500 text-xs">
            {new Date().toLocaleDateString()} ·{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </section>
      </div>

      <div className="flex flex-col gap-3">
        {messages && messages.map((msg) => {
         const isSender = msg.senderId === user?._id;

          return (
            <div
              key={msg._id}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm break-words ${
                  isSender
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
