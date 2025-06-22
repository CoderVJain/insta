// import {
//   Heart,
//   Home,
//   LogOut,
//   MessageCircle,
//   PlusSquare,
//   Search,
//   TrendingUp,
// } from "lucide-react";
// import React, { useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { toast } from "sonner";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setAuthUser, setSelectedUser } from "@/redux/Slices/authSlice";
// import CreatePost from "./CreatePost";
// import { Popover, PopoverContent } from "./ui/popover";
// import { PopoverTrigger } from "@radix-ui/react-popover";
// import { Button } from "./ui/button";

// const SiderBar = () => {
//   const navigate = useNavigate();
//   const { user } = useSelector((store) => store.auth);
//   const [open, setOpen] = useState(false);
//   const { likeNotification } = useSelector(
//     (store) => store.realTimeNotification
//   );
//   const dispatch = useDispatch();

//   const logoutHandler = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
//         withCredentials: true,
//       });

//       if (res.data.success) {
//         dispatch(setAuthUser(null));
//         navigate("/login");
//         toast.success(res.data.message);
//       }
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message ||
//           "Something went wrong. Please try again."
//       );
//     }
//   };

//   const sideBarHandler = (textType) => {
//     if (textType === "Logout") {
//       logoutHandler();
//     } else if (textType === "Create") {
//       setOpen(true);
//     } else if (textType === "Profile") {
//       navigate(`/profile/${user?._id}`);
//     } else if (textType === "Home") {
//       navigate(`/`);
//     } else if (textType === "Messages") {
//       dispatch(setSelectedUser(null));
//       navigate("/chat");
//     }
//   };

//   const sideBarItems = [
//     { icon: <Home />, text: "Home" },
//     { icon: <Search />, text: "Search" },
//     { icon: <TrendingUp />, text: "Explore" },
//     { icon: <MessageCircle />, text: "Messages" },
//     { icon: <Heart />, text: "Notifications" },
//     { icon: <PlusSquare />, text: "Create" },
//     {
//       icon: (
//         <Avatar className="w-7 h-7">
//           <AvatarImage src={user?.profilePicture} />
//           <AvatarFallback>CN</AvatarFallback>
//         </Avatar>
//       ),
//       text: "Profile",
//     },
//     { icon: <LogOut />, text: "Logout" },
//   ];

//   return (
//     <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
//       <div className="flex flex-col">
//         <img src="./assets/instagram-1.png" alt="" className="w-40 mt-5 p-3" />
//         <div>
//           {sideBarItems.map((item, index) => {
//             return (
//               <div
//                 onClick={() => sideBarHandler(item.text)}
//                 key={index}
//                 className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
//               >
//                 {item.icon}
//                 <span>{item.text}</span>
//                 {item.text === "Notifications" &&
//                   likeNotification.length > 0 && (
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <Button
//                           size="icon"
//                           className="rounded-full h-5 w-5 absolute bottom-6 left-6"
//                         >
//                           {likeNotification?.length}
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent>
//                         <div>
//                           {likeNotification.length === 0 ? (
//                             <p>No new notifcation</p>
//                           ) : (
//                             likeNotification.map((notification) => {
//                               return (
//                                 <div key={notification?.userId}>
//                                   <Avatar className="w-7 h-7">
//                                     <AvatarImage src={notification.userDetails?.profilePicture}/>
//                                     <AvatarFallback>CN</AvatarFallback>
//                                   </Avatar>
//                                   <p className="text-sm"><span className="font-bold">{notification.userDetails?.userName} liked you post</span></p>
//                                 </div>
//                               );
//                             })
//                           )}
//                         </div>
//                       </PopoverContent>
//                     </Popover>
//                   )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <CreatePost user={user} open={open} setOpen={setOpen} />
//     </div>
//   );
// };
// export default SiderBar;

import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setSelectedUser } from "@/redux/Slices/authSlice";
import CreatePost from "./CreatePost";
import { Popover, PopoverContent } from "./ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "./ui/button";
import { removeLikeNotification } from "@/redux/Slices/rtnSlice";
import { removeMsgNotification } from "@/redux/Slices/msgSlice";

const SiderBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const { msgNotification } = useSelector(
    (store) => store.realTimeMsgNotification
  );

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const sideBarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate(`/`);
    } else if (textType === "Messages") {
      dispatch(setSelectedUser(null));
      navigate("/chat");
    }
  };

  const sideBarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-7 h-7">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <div className="fixed top-0 left-0 z-10 px-4 border-r border-gray-300 w-[16%] h-screen bg-white">
      <div className="flex flex-col h-full justify-between">
        {/* Top Section */}
        <div>
          <img
            src="./assets/instagram-1.png"
            alt="Instagram Logo"
            className="w-36 mt-6 mb-8 mx-auto"
          />
          <div className="space-y-2">
            {sideBarItems.map((item, index) => (
              <div
                onClick={() => sideBarHandler(item.text)}
                key={index}
                className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg px-4 py-2"
              >
                {item.icon}
                <span className="text-sm font-medium">{item.text}</span>

                {/* Notifications popover */}
                {item.text === "Notifications" &&
                  likeNotification.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          className="rounded-full h-5 w-5 absolute bottom-6 left-6 bg-red-500 hover:bg-red-500 text-white text-xs"
                        >
                          {likeNotification.length}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="space-y-2">
                          {likeNotification.map((notification) => (
                            <div
                              key={notification.userId}
                              className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                              onClick={() =>
                                dispatch(
                                  removeLikeNotification(notification._id)
                                )
                              }
                            >
                              <Avatar className="w-7 h-7">
                                <AvatarImage
                                  src={notification.userDetails?.profilePicture}
                                />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <p className="text-sm">
                                <span className="font-bold">
                                  {notification.userDetails?.userName} liked
                                  your post
                                </span>
                              </p>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}

                {/* Messages popover */}
                {item.text === "Messages" && msgNotification.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full h-5 w-5 absolute bottom-6 left-6 bg-red-500 hover:bg-red-500  text-white text-xs"
                      >
                        {msgNotification.length}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="space-y-2">
                        {msgNotification.map((notification) => (
                          <div
                            key={notification.userId}
                            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                            onClick={() =>
                              dispatch(
                                removeMsgNotification(notification.userId)
                              )
                            }
                          >
                            <Avatar className="w-7 h-7">
                              <AvatarImage
                                src={notification.userDetails?.profilePicture}
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p className="text-sm">
                              <span className="font-bold">
                                {notification.userDetails?.userName}
                              </span>{" "}
                              messaged you
                            </p>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section (Optional for more spacing) */}
        <div className="mb-6" />
      </div>

      {/* Create Post Dialog */}
      <CreatePost user={user} open={open} setOpen={setOpen} />
    </div>
  );
};

export default SiderBar;
