import React, { memo, useEffect, useRef, useState } from "react";
import { deleteComment, editComment, likeComments } from "../comment.service";
import { toast } from "sonner";
import { timeAgo } from "@/utils/constants";
import { Heart, SendIcon } from "lucide-react";
import ToggleMenu from "@/components/ToggleMenu";

const CommentListData = ({
  comment,
  setComments,
  postId,
  updatePostCommentCount,
}) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const menuRef = useRef(null);

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await deleteComment(postId, commentId);
      if (res.status === 200) {
        toast.success("Comment Deleted Successfully");
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId),
        );
        updatePostCommentCount?.(postId, -1);
      }
    } catch (error) {
      console.error("Something went wrong to delete comment");
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(false);
        setEditingCommentId(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditComment = async (commentId) => {
    if (!editingText.trim()) return toast.error("Comment cannot be empty");
    try {
      const res = await editComment(editingText, commentId);
      if (res.status === 200) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId ? { ...c, text: res.data.comment.text } : c,
          ),
        );
        setEditingCommentId(null);
        setEditingText("");
        toast.success("Comment updated!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to edit comment");
    }
  };

  const likeComment = async (commentId) => {
    try {
      const res = await likeComments(commentId);
      if (res.status === 200) {
        // Update comment likes locally
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId ? { ...c, likes: res.data.totalLike } : c,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to like comment", error);
    }
  };

  return (
    <div key={comment._id} className="mt-3">
      <div className="flex justify-between items-start gap-3 group">
        <div className="flex gap-3 w-full">
          {/* Avatar */}
          <img
            src={comment.creatorId?.imageUrl}
            alt="user"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200"
          />

          {/* Comment Bubble */}
          <div className="bg-gray-100 dark:bg-neutral-800 rounded-2xl px-4 py-2 w-full max-w-[520px] shadow-sm">
            {/* Name */}
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {comment.creatorId?.name}
            </p>

            {/* Edit Mode */}
            {editingCommentId === comment._id ? (
              <div className="flex items-center gap-2 mt-2">
                <input
                  className="flex-1 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />

                <SendIcon
                  onClick={() => handleEditComment(comment._id)}
                  className="w-5 h-5 text-blue-500 cursor-pointer hover:scale-110 transition"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {comment.text}
              </p>
            )}

            {/* Image */}
            {comment.imageUrl && (
              <img
                src={comment.imageUrl}
                className="rounded-lg mt-2 w-44 h-44 object-cover"
                alt=""
              />
            )}

            {/* Footer */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
              <span>{timeAgo(comment.createdAt)}</span>

              <button
                onClick={() => likeComment(comment._id)}
                className="flex items-center gap-1 hover:text-red-500 transition"
              >
                <Heart className="w-4 h-4" />
                {comment.likes?.length || 0}
              </button>
            </div>
          </div>
          <ToggleMenu
            menuRef={menuRef}
            setMenuOpen={setActiveMenu}
            isMenuOpen={activeMenu}
            handleDelete={handleDeleteComment}
            setEditing={setEditingCommentId}
            id={comment._id}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(CommentListData);
