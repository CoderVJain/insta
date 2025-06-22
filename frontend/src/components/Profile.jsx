import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import CommentDialog from "./CommentDialog";
import { setSelectedPost } from "@/redux/Slices/postSlice";
import axios from "axios";
// import { setAuthUser, setUserProfile } from "@/redux/Slices/authSlice";
import { toast } from "sonner";
import { setAuthUser, setUserProfile } from "@/redux/Slices/authSlice";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const { user, userProfile } = useSelector((store) => store.auth);
  const [activeTab, setActiveTab] = useState("posts");
  const [open, setOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const dispatch = useDispatch();

  const isLoggedInUserProfile = user?._id === userId;

  useEffect(() => {
    // Check if the logged-in user is following the profile user
    setIsFollowing(user?.following?.includes(userId));
  }, [user?.following, userId]);

  const displayedPost =
    activeTab === "posts"
      ? userProfile?.posts ?? []
      : userProfile?.bookmarks ?? [];

  const activeTabHandler = (tab) => {
    setActiveTab(tab);
  };

  // const mutualFollowers = suggestedUsers
  //   ?.filter((u) => {
  //     const isFollowedByMe = user?.following?.some((id) => id === u._id);
  //     const followsProfile = userProfile?.followers?.some((id) => id === u._id);
  //     return isFollowedByMe && followsProfile;
  //   })
  //   ?.map((u) => u.userName)
  //   .slice(0, 3);

  const folowUnfollowHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/followOrUnfollow/${userId}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const isCurrentlyFollowing = user.following.includes(userId);

        // --- Update logged-in user's following list
        const updatedFollowing = isCurrentlyFollowing
          ? user.following.filter((id) => id !== userId)
          : [...user.following, userId];

        dispatch(
          setAuthUser({
            ...user,
            following: updatedFollowing,
          })
        );

        // --- Update profile user's followers list
        const updatedFollowers = isCurrentlyFollowing
          ? userProfile.followers.filter((id) => id !== user._id)
          : [...userProfile.followers, user._id];

        

        dispatch(
          setUserProfile({
            ...userProfile,
            followers: updatedFollowers,
          })
        );

        setIsFollowing((prev) => !prev);
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

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10 ">
      <div className="flex flex-col gap-20 p-15">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-36 w-36">
              <AvatarImage
                className="h-36 w-36"
                src={userProfile?.profilePicture}
                alt="profilePhoto"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="font-semibold">{userProfile?.userName}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8"
                      >
                        Edit Profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View Archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Ad Tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button
                      variant="secondary"
                      className="text-sm text-white cursor-pointer bg-[#969696] hover:bg-[#727272] h-8"
                      onClick={folowUnfollowHandler}
                    >
                      UnFollow
                    </Button>
                    <Button
                      variant="secondary"
                      className="text-sm text-white cursor-pointer bg-[#969696] hover:bg-[#727272] h-8"
                    >
                      Message
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="secondary"
                    className="cursor-pointer bg-[#2780f5] hover:bg-[#1877F2] h-8"
                    onClick={folowUnfollowHandler}
                  >
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}{" "}
                  </span>
                  posts
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers.length}{" "}
                  </span>
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following.length}{" "}
                  </span>
                  following
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <Badge className="w-fit" variant="seconday">
                  <AtSign />{" "}
                  <span className="pl-1">{userProfile?.userName}</span>
                </Badge>
                <span className="font-semibold">{userProfile?.bio}</span>
                {/* {mutualFollowers?.length > 0 && (
                  <span className="text-sm text-gray-500">
                    Followed by {mutualFollowers.join(", ")}
                  </span>
                )} */}
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-300">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => activeTabHandler("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => activeTabHandler("saved")}
            >
              SAVED
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "reels" ? "font-bold" : ""
              }`}
              onClick={() => activeTabHandler("reels")}
            >
              REELS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "tags" ? "font-bold" : ""
              }`}
              onClick={() => activeTabHandler("tags")}
            >
              TAGS
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 ml-10">
            {displayedPost.map((post) => {
              return (
                <div
                  key={post?._id}
                  className="relative group my-2 cursor-pointer"
                  onClick={() => {
                    dispatch(setSelectedPost(post));
                    setOpen(true);
                  }}
                >
                  <img
                    src={post?.image}
                    alt="postimage"
                    className="rounded-sm w-full aspect-square object-cover"
                  />
                  <div className="rounded absolute inset-0 bg-black/30 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ">
                    <div className="flex items-center text-white gap-4 font-semibold text-sm">
                      <button className="flex items-center gap-2 cursor-pointer">
                        <Heart className="w-5 h-5 fill-white" />
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2 cursor-pointer">
                        <MessageCircle className="w-5 h-5 fill-white" />
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <CommentDialog open={open} setOpen={setOpen} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
