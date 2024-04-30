import React, { useEffect } from "react";
import "./GistGridLayout.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import SyntaxHighlighter from "react-syntax-highlighter";
import { ascetic } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Avatar } from "antd";
import axios from "axios";

const GistGridLayout: React.FC = () => {
  const gists = useSelector((state: RootState) => state.gists);

  useEffect(() => {
    const fetchData = async () => {
      try {
        gists.forEach(async (gist) => {
          const response = await axios.get(
            gist.files[Object.keys(gist.files)[0]].raw_url
          );
          gist.files[Object.keys(gist.files)[0]].content = response.data;
        });
      } catch (error) {
        console.log(error + " error");
      }
      console.log("Gists Content");
    };
    fetchData();
  }, [gists.length]);

  // codeString = codeString.split("\n").slice(0, 13).join("\n");
  return (
    <div className="gist-grid-layout">
      {gists.map((gist) => {
        return (
          <div
            key={gist.id}
            className="border h-80 w-96 border-gray-200 rounded-lg shadow flex justify-between flex-col p-1 overflow-hidden"
          >
            <SyntaxHighlighter
              customStyle={{
                backgroundColor: "white",
                width: "100%",
                fontSize: "0.7rem",
                fontWeight: "bold",
                letterSpacing: "0.1px",
                overflow: "hidden",
              }}
              lineNumberStyle={{
                color: "lightgray",
              }}
              wrapLongLines={true}
              showLineNumbers
              language=""
              style={{
                ascetic,
              }}
            >
              {gist.files[Object.keys(gist.files)[0]]?.content || ""}
            </SyntaxHighlighter>
            <div className="flex flex-row gap-3 justify-start items-center py-3 mx-4 mt-4 border-t border-gray-300">
              <Avatar size={50} src={gist.owner.avatar_url} />
              <div className="flex flex-col">
                <div className="text-sm font-bold text-blue-500">
                  {gist.owner.login} /{" "}
                  {gist.files[Object.keys(gist.files)[0]].filename}
                </div>
                <div className="text-xs text-gray-500">{gist.created_at}</div>
                <div className="text-gray-300 text-xs">{gist.description}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GistGridLayout;
