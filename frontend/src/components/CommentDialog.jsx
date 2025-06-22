// import React, { useEffect, useState } from "react";
// import { Dialog, DialogContent } from "./ui/dialog";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { Link } from "react-router-dom";
// import { DialogTrigger } from "@radix-ui/react-dialog";
// import { MoreHorizontal } from "lucide-react";
// import { Button } from "./ui/button";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { toast } from "sonner";
// import { setPosts, setSelectedPost } from "@/redux/Slices/postSlice";

// const CommentDialog = ({ open, setOpen }) => {
//   const [text, setText] = useState("");
//   const { selectedPost } = useSelector((store) => store.post);
//   const { posts } = useSelector((store) => store.post);
//   const [comment, setComment] = useState([]);

//   useEffect(() => {
//     if (selectedPost) setComment(selectedPost?.comments || []);
//   }, [selectedPost]);

//   const dispatch = useDispatch();

//   const changeEventHandler = (e) => {
//     const inputText = e.target.value;
//     if (inputText.trim()) {
//       setText(inputText);
//     } else {
//       setText("");
//     }
//   };

//   const sendMessageHandler = async () => {
//     try {
//       const res = await axios.post(
//         `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,
//         { text },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );

//       if (res.data.success) {
//         const updatedCommentData = [...comment, res.data.comment];
//         setComment(updatedCommentData);

//         const updatedPostData = posts.map((p) =>
//           p._id === selectedPost._id
//             ? {
//                 ...p,
//                 comments: updatedCommentData,
//               }
//             : p
//         );

//         console.log(updatedPostData);
//         dispatch(setPosts(updatedPostData));
//         dispatch(
//           setSelectedPost({
//             ...selectedPost,
//             comments: updatedCommentData,
//           })
//         );
//         toast.success(res.data.message);
//         setText("");
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(
//         error?.response?.data?.message ||
//           "Something went wrong. Please try again."
//       );
//     }
//   };

//   return (
//     <Dialog open={open}>
//       <DialogContent
//         onInteractOutside={() => setOpen(false)}
//         className="max-w-5xl h-[80vh] p-0 flex flex-col"
//       >
//         <div className="flex flex-1">
//           <div className="w-1/2">
//             <img
//               src={selectedPost?.image}
//               alt="post_img"
//               className="w-full h-full object-cover rounded-l-lg"
//             />
//           </div>
//           <div className="w-1/2 flex flex-col justify-between">
//             <div className="flex items-center justify-between p-4">
//               <div className="flex items-center gap-3">
//                 <Link>
//                   <Avatar>
//                     <AvatarImage src={selectedPost?.author?.profilePicture} />
//                     <AvatarFallback>CN</AvatarFallback>
//                   </Avatar>
//                 </Link>
//                 <div>
//                   <Link className="font-semibold text-xs">
//                     {selectedPost?.author?.userName}
//                   </Link>
//                   {/* <span className="text-gray-600 text-sm">Bio here.. </span> */}
//                 </div>
//               </div>

//               <Dialog>
//                 <DialogTrigger asChild>
//                   <MoreHorizontal className="cursor-pointer" />
//                 </DialogTrigger>
//                 <DialogContent className="flex flex-col items-center text-sm text-center">
//                   <div className="cursor-pointer w-full text-[#ED4956] font-bold">
//                     Unfollow
//                   </div>
//                   <div className="cursor-pointer w-full ">Add to favorites</div>
//                 </DialogContent>
//               </Dialog>
//             </div>
//             <hr />
//             <div className="flex-1 overflow-y-auto max-h-96 p-4">
//               {selectedPost.comments.map((comment) => (
//                 <div key={comment._id} className="flex items-start gap-3 mb-4">
//                   <Avatar className="w-8 h-8">
//                     <AvatarImage src={comment?.author?.profilePicture} />
//                     <AvatarFallback>CN</AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1">
//                     <p className="text-sm">
//                       <span className="font-semibold mr-1">
//                         {comment?.author?.userName}
//                       </span>
//                       {comment?.text}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="p-4">
//               <div className="flex items-center gap-2">
//                 <input
//                   type="text"
//                   value={text}
//                   onChange={changeEventHandler}
//                   placeholder="Add a comment..."
//                   className="w-full outline-none border border-gray-300 p-2 rounded"
//                 />
//                 <Button
//                   disabled={!text.trim()}
//                   onClick={sendMessageHandler}
//                   variant="outline"
//                 >
//                   Send
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CommentDialog;

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/Slices/postSlice";


const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) setComment(selectedPost?.comments || []);
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );

        dispatch(setPosts(updatedPostData));
        dispatch(
          setSelectedPost({
            ...selectedPost,
            comments: updatedCommentData,
          })
        );
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl h-[80vh] p-0 flex rounded-xl overflow-hidden"
      >
        <div className="flex w-full">
          {/* Left: Image */}
          <div className="w-1/2 bg-black">
            <img
              src={selectedPost?.image}
              alt="post_img"
              className="w-full h-full object-contain bg-black"
            />
          </div>

          {/* Right: Comments and Actions */}
          <div className="w-1/2 flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Link to={`/profile/${selectedPost?.author?._id}`}> 
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <Link
                  to={`/profile/${selectedPost?.author?._id}`}
                  className="font-semibold text-sm"
                >
                  {selectedPost?.author?.userName}
                </Link>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer text-gray-600" />
                </DialogTrigger>
                <DialogContent className="flex flex-col gap-3 text-sm">
                  <div className="cursor-pointer text-red-600 font-semibold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer">Add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Comments */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {comment.map((comment) => (
                <div key={comment._id} className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p className="text-sm">
                    <span className="font-semibold mr-1">
                      {comment?.author?.userName}
                    </span>
                    {comment?.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <div className="p-2 border-t">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder="Add a comment..."
                  className="flex-1 border border-gray-300 p-2 rounded text-sm outline-none"
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  variant="outline"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
