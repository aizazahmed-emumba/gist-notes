import React from "react";
import toast from "react-hot-toast";
import { gistAPI } from "../../API/GistAPI";
import { ForkOutlined } from "@ant-design/icons";

interface GistForkProps {
  gistId: string;
  removeText?: boolean;
  white?: boolean;
}

const index: React.FC<GistForkProps> = ({ gistId, removeText, white }) => {
  const handleForkGist = async () => {
    try {
      const res = await gistAPI.post(`/gists/${gistId}/forks`);
      if (res.status === 201) {
        toast.success("Gist Forked Successfully");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to fork Gist");
    }
  };

  return (
    <div onClick={handleForkGist} className="cursor-pointer flex gap-2">
      <ForkOutlined
        className={`${white ? "action-icon-whie" : "action-icon "}`}
      />{" "}
      {!removeText && "Fork"}
    </div>
  );
};

export default index;
