import { StarFilled, StarOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { gistAPI } from "../../API/GistAPI";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import "./GistStar.scss";

interface GistStarProps {
  gistId: string;
  removeText?: boolean;
}

const index: React.FC<GistStarProps> = ({ gistId, removeText }) => {
  const [isStarred, setIsStarred] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.userState.user);

  const fetchStarredStatus = async () => {
    try {
      const res = await gistAPI.get(`/gists/${gistId}/star`);
      if (res.status === 204) {
        setIsStarred(true);
      }
    } catch (err: any) {
      console.log(err);
      if (err?.response?.status !== 404) {
        toast.error("Failed to fetch starred status");
      }
    }
  };

  useEffect(() => {
    fetchStarredStatus();
  }, []);

  const handleStarGist = async () => {
    try {
      setIsStarred((prevIsStarred) => !prevIsStarred);
      if (isStarred) {
        await gistAPI.delete(`/gists/${gistId}/star`);
      } else {
        await gistAPI.put(`/gists/${gistId}/star`);
      }
    } catch (err) {
      setIsStarred((prevIsStarred) => !prevIsStarred);
      console.log(err);
      if (!user) toast.error("Login to star Gist");
      else {
        toast.error("Failed to star Gist");
      }
    }
  };

  return (
    <div
      onClick={handleStarGist}
      className="cursor-pointer w-full h-full flex gap-2"
    >
      {isStarred ? (
        <>
          <StarFilled className="action-icon-white" /> {!removeText && "Star"}
        </>
      ) : (
        <>
          <StarOutlined className="action-icon-white" /> {!removeText && "Star"}
        </>
      )}
    </div>
  );
};

export default index;
