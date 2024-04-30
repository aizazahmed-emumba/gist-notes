import { PlusOutlined, UnorderedListOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import GistGridLayout from "../Components/GistGridLayout/GistGridLayout";
import { Octokit } from "octokit";
import { useDispatch } from "react-redux";
import { Gist, addGists } from "../Slices/gistsSlice";
import toast from "react-hot-toast";
import { Spin } from "antd";
import axios from "axios";

const HomePage: React.FC = () => {
  const [gridLayout, setGridLayout] = React.useState<boolean>(true);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    const octokit = new Octokit();
    const getGists = async () => {
      try {
        setLoading(true);
        const response = await octokit.request("GET /gists?per_page=9&page=3");
        console.log(response);
        if (response.status === 200) {
          const contentPromises = response.data.map(async (gist: any) => {
            const contentResponse = await axios.get(
              gist.files[Object.keys(gist.files)[0]].raw_url!
            );
            console.log(contentResponse.data);
            contentResponse.data = contentResponse.data
              .split("\n")
              .slice(0, 13)
              .join("\n");
            gist.files[Object.keys(gist.files)[0]].content =
              contentResponse.data;
          });

          await Promise.all(contentPromises);

          dispatch(addGists(response.data));
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch gists");
      } finally {
        setLoading(false);
      }
    };

    getGists();

    return () => {};
  }, []);

  return (
    <div className="py-10">
      <div className="flex justify-end items-center">
        <div className="flex justify-between items-center w-14">
          <div
            onClick={() => setGridLayout(true)}
            className="border-2 border-green-600 h-5 flex justify-center items-center cursor-pointer"
          >
            <PlusOutlined className="p-0 m-0 w-full h-full text-green-600" />
          </div>
          <div className="border border-green-600 min-h-full h-5"></div>
          <div className="cursor-pointer" onClick={() => setGridLayout(false)}>
            <UnorderedListOutlined className="text-green-600" />
          </div>
        </div>
      </div>

      {loading ? <Spin /> : gridLayout ? <GistGridLayout /> : <div>List</div>}
    </div>
  );
};

export default HomePage;
