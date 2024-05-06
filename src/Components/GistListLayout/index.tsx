import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Avatar, ConfigProvider, Table, TableColumnsType } from "antd";
import { Gist } from "../../Types/Gist";
import { convertDateToTime } from "../../Utils/convertDateToTime";
import { convertToCustomDateFormat } from "../../utils/convertToCustomDateFormat";
import GistStar from "../GistStar";
import GistFork from "../GistFork";
import "./GistListLayour.scss";

const index: React.FC = () => {
  const gists = useSelector((state: RootState) => state.gists.value);

  const columns: TableColumnsType<Gist> = [
    {
      title: "Name",
      dataIndex: "owner",
      render: (owner: any) => (
        <div className="flex max-w-52 justify-between items-center gap-4">
          <Avatar size={50} src={owner.avatar_url} />
          <div>{owner.login}</div>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      render: (text: string) => <a>{convertToCustomDateFormat(text)}</a>,
    },
    {
      title: "Time",
      dataIndex: "created_at",
      render: (text: string) => <a>{convertDateToTime(text)}</a>,
    },
    {
      title: "Keyword",
      dataIndex: "description",
      render: (text: string) => {
        if (!text) return null;
        const keywords = text.split(" ");
        return (
          <div className="flex justify-center items-center">
            <span className="keyword">{keywords[0]}</span>
          </div>
        );
      },
    },
    {
      title: "Notebook Name",
      dataIndex: "files",
      render: (files: any) => <a>{files[Object.keys(files)[0]].filename}</a>,
    },
    {
      title: "",
      dataIndex: "id",
      render: (id: string) => (
        <div className="flex justify-center items-center gap-5">
          <GistStar removeText gistId={id} />
          <GistFork removeText gistId={id} />
        </div>
      ),
    },
  ];

  return (
    <div className="mt-10">
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#EFEFEF",
            },
          },
        }}
      >
        <Table pagination={false} columns={columns} dataSource={gists} />
      </ConfigProvider>
    </div>
  );
};

export default index;
