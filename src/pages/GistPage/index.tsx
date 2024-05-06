import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { gistAPI } from "../../API/GistAPI";
import { Gist } from "../../Types/Gist";
import GistDescription from "../../Components/GistDescription";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import CodeOutput from "../../Components/CodeOutput";
import GistStarWhite from "../../Components/GistStar/WhiteStar";
import GistFork from "../../Components/GistFork";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./GistPage.scss";
import { RootState } from "../../store";
import { Spin } from "antd";

const index: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [gist, setGist] = useState<Gist | null>(null);
  const [Loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: RootState) => state.userState.user);

  const navigation = useNavigate();

  const fetchGist = async () => {
    try {
      const res = await gistAPI.get(`/gists/${id}`);
      console.log(res.data);
      setGist(res.data);
      setLoading(false);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        toast.error("Login to view Gist");
      } else {
        toast.error("Failed to fetch Gist");
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGist();
  }, [id]);

  const handleDeleteGist = async () => {
    try {
      const res = await gistAPI.delete(`/gists/${gist?.id}`);
      if (res.status === 204) {
        toast.success("Gist Deleted Successfully");
        navigation("/");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete Gist");
    }
  };

  if (Loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin />
      </div>
    );

  if (!gist) return <div>No Gist Found</div>;

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center">
        <div>
          <GistDescription gist={gist!} />
        </div>
        <div
          className={`flex ${
            user?.screenName === gist.owner.login
              ? "justify-between"
              : "justify-center"
          } items-center w-1/3`}
        >
          {user?.screenName === gist.owner.login && (
            <>
              <Link
                to={"/edit/" + gist.id}
                className="cursor-pointer mx-2 flex gap-1 items-center w-full justify-center button "
              >
                <div>
                  <EditOutlined />
                </div>
                <div>Edit</div>
              </Link>
              <div
                onClick={handleDeleteGist}
                className="cursor-pointer mx-2 flex gap-2 items-center w-full justify-center button"
              >
                <div>
                  <DeleteOutlined />
                </div>
                <div>Delete</div>
              </div>
            </>
          )}
          <div className="cursor-pointer mx-2 flex justify-center items-center border border-[#003B44] rounded-lg">
            <div className="text-white bg-[#003B44]  w-full rounded-lg p-[10px] rounded-r-none ">
              {gist && <GistStarWhite gistId={gist.id} />}
            </div>
            <div className="bg-white rounded-lg p-[10px] px-[15px]">0</div>
          </div>
          <div className="cursor-pointer mx-2 flex justify-center items-center border border-[#003B44] rounded-lg">
            <div className="text-white bg-[#003B44]  w-full rounded-lg p-[10px] rounded-r-none">
              <GistFork white gistId={gist.id} />
            </div>
            <div className="bg-white rounded-lg p-[10px] px-[15px]">
              {gist.forks.length}
            </div>
          </div>
        </div>
      </div>

      <CodeOutput
        disableOverlay
        fileLanguage={
          gist.files[Object.keys(gist.files)[0]]?.language || "javascript"
        }
        lineNumberMargin
        content={gist.files[Object.keys(gist.files)[0]]?.content || ""}
        filename={gist.files[Object.keys(gist.files)[0]]?.filename}
        fontSize="0.9rem"
        height="full"
        width="full"
        codeIcon
      />
    </div>
  );
};

export default index;
