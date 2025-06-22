import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { getFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/Slices/postSlice";

const CreatePost = ({ user, open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!open) {
      // Reset form values when dialog closes
      setCaption("");
      setFile("");
      setImagePreview("");
    }
  }, [open]);

  const getFileHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await getFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(setPosts([response.data.post, ...posts]));
        toast.success(response.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">
          Create new post
        </DialogHeader>
        <div className="flex w-full max-w-3xl mx-auto overflow-hidden ">
          <div>
            {imagePreview && (
              <div className="w-full max-w-md mx-auto mt-4 aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="postImage"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col ml-5 justify-around">
            <div className="flex gap-3 items-center">
              <Avatar>
                <AvatarImage src={user?.profilePicture} alt="img" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-semibold text-xs">{user?.userName}</h1>
                <span className="text-gray-600 text-xs">{user?.bio}</span>
              </div>
            </div>

            <Textarea
              className="resize-none focus-visible:ring-transparent border border-none rounded-md text-sm mt-5 break-word"
              placeholder="Write a caption..."
              style={{ wordBreak: "break-word" }}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <div className="mt-25">
              <input
                ref={imageRef}
                type="file"
                className="hidden"
                onChange={getFileHandler}
              />
              <Button
                onClick={() => imageRef.current.click()}
                className="w-fit mx-auto bg-[#0095F6] hover:bg-[#0574be] cursor-pointer"
              >
                Select from Computer
              </Button>
              {imagePreview &&
                (loading ? (
                  <Button>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </Button>
                ) : (
                  <Button
                    onClick={createPostHandler}
                    type="submit"
                    className=" flex items-center mt-2 w-full mx-auto cursor-pointer"
                  >
                    Post
                  </Button>
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
