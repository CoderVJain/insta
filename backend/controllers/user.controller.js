import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import Post from '../models/post.model.js';

export const register = async (req, res) => {
    try {
        const { userName, password, email } = req.body;
        if (!userName || !password || !email) {
            return res.status(400).json({
                message: "Please fill in all fields.",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Email already exists.",
                success: false,
            });
        };

        const existingUsername = await User.findOne({ userName });
        if (existingUsername) {
            return res.status(401).json({
                message: "Username already exists.",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            userName,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill in all fields.",
                success: false,
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }



        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect password",
                success: false,
            });
        };

        // token for authetication
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        // populate each postId in the post array
        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        )

        const populatedBookmarks = await Promise.all(
            user.bookmarks.map(async (postId) => {
                const post = await Post.findById(postId);
                return post ?? null;
            })
        );

        user = {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts,
            bookmarks: populatedBookmarks
        }

        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: "Logged in successfully.",
            success: true,
            user
        })


    } catch (error) {
        console.error("Login Error:", error);
    }
};

export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true,
        });
    } catch (error) {
        console.error("Logout Error:", error);
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId)
            .populate({
                path: 'posts',
                options: { sort: { createdAt: -1 } },
                populate: [
                    {
                        path: 'author',
                        select: 'userName profilePicture'
                    },
                    {
                        path: 'comments',
                        select: 'author text',
                        populate: {
                            path: 'author',
                            select: 'userName profilePicture'
                        }
                    }
                ]
            })
            .populate({
                path: 'bookmarks',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'author',
                    select: 'userName profilePicture'
                }
            });


        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri)
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user
        });
    } catch (error) {
        console.log(error)
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(404).json({
                message: "No users found",
                success: false
            });
        };

        return res.status(200).json({
            success: true,
            users: suggestedUsers
        });

    } catch (error) {
        console.log(error)
    }
};

export const followOrUnfollow = async (req, res) => {
    try {
        const loggedInUserId = req.id; // myself
        const targetUserId = req.params.id;

        if (loggedInUserId === targetUserId) {
            return res.status(400).json({ message: "You cannot follow/unfollow yourself", success: false });
        }

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(loggedInUserId);

        if (!currentUser || !targetUser) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Check if user is already following
        const isFollowing = currentUser.following.includes(targetUserId);

        if (isFollowing) {
            // unfollow
            await Promise.all([
                User.updateOne({ _id: loggedInUserId }, { $pull: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $pull: { followers: loggedInUserId } })
            ]);
            return res.status(200).json({
                message: "Unfollowed successfully",
                success: true
            });
        } else {
            // follow
            await Promise.all([
                User.updateOne({ _id: loggedInUserId }, { $push: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $push: { followers: loggedInUserId } })
            ]);
            return res.status(200).json({
                message: "Followed successfully",
                success: true
            });
        }
    } catch (error) {
        console.log(error)
    }
}