import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Avatar, ConfigProvider, Table, TableColumnsType } from "antd";
import { Gist } from "../../types/Gist";
import GistStar from "../../components/GistStar";
import GistFork from "../../components/GistFork";
import "./GistListLayour.scss";
import formatRelativeTime from "../../utils/formatRelativeTime";

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
      title: "Notebook Name",
      dataIndex: "files",
      render: (files: any) => <a>{files[Object.keys(files)[0]].filename}</a>,
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
      title: "Updated",
      dataIndex: "updated_at",
      render: (text: string) => <a>{formatRelativeTime(text)}</a>,
    },
    {
      title: "",
      dataIndex: "id",
      render: (id: string) => (
        <div className="flex justify-center items-center gap-5">
          <GistStar key={id} removeText gistId={id} />
          <GistFork forks={[]} key={id} removeText gistId={id} />
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
