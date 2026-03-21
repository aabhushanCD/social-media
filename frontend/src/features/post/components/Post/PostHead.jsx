import ToggleMenu from "@/components/ToggleMenu";
import { timeAgo } from "@/utils/constants";
import { MoreHorizontal, Trash2, Pencil, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PostHead = ({ currentUser, post, handlePostDelete }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isOwnPost = currentUser.userId === post.creatorId._id;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
      {/* Profile */}
      <div
        className="flex items-center gap-3 cursor-pointer rounded-xl px-2 py-1.5 -mx-2 -my-1.5 hover:bg-gray-50 transition-colors"
        onClick={() =>
          navigate(
            !isOwnPost ? `/user/profile/${post.creatorId._id}` : "/profile/",
          )
        }
      >
        {post.creatorId?.imageUrl ? (
          <img
            src={post.creatorId.imageUrl}
            alt={`${post.creatorId.name}'s profile`}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold text-sm flex-shrink-0">
            {post.creatorId?.name?.charAt(0) || currentUser.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            {post.creatorId.name ||
              (post.creatorId._id === currentUser._id && currentUser.name)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">
            {timeAgo(post.createdAt)}
          </p>
        </div>
      </div>

      {/* Menu */}
      <ToggleMenu
        menuRef={menuRef}
        setMenuOpen={setMenuOpen}
        isMenuOpen={isMenuOpen}
        handleDelete={handlePostDelete}
        id={post._id}
      />
    </div>
  );
};

export default PostHead;
