import { Avatar } from "antd";
import React from "react";
import { Gist } from "../../types/Gist";
import formatRelativeTime from "../../utils/formatRelativeTime";

interface GistDescriptionProps {
  gist: Gist;
}

const index: React.FC<GistDescriptionProps> = ({ gist }) => {
  return (
    <div className="flex flex-row gap-3 justify-start items-center py-3 ml-2 ">
      <Avatar size={50} src={gist?.owner.avatar_url} />
      <div className="flex flex-col">
        <div className="text-sm mr-1 font-bold text-blue-500 overflow-hidden text-ellipsis inline-block whitespace-nowrap ">
          {gist?.owner?.login} /{" "}
          {gist.files[Object.keys(gist?.files)[0]].filename}
        </div>
        <div className="text-xs text-gray-500">
          {formatRelativeTime(gist.created_at)}
        </div>
        <div className="text-gray-300 text-xs overflow-hidden text-ellipsis inline-block whitespace-nowrap">
          {gist?.description?.slice(0, 50) || "No Description"}
        </div>
      </div>
    </div>
  );
};

export default index;
