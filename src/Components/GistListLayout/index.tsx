import React from 'react';
import { useSelector } from 'react-redux';
// eslint-disable-next-line import/named
import { Avatar, ConfigProvider, Table, TableColumnsType } from 'antd';
import { RootState } from '../../store';
import { Gist, GistFiles } from '../../types/Gist';
import GistStar from '../GistStar';
import GistFork from '../GistFork';
import './GistListLayour.scss';
import formatRelativeTime from '../../utils/formatRelativeTime';
import { Owner } from '../../types/Owner';

const GistListLayout: React.FC = () => {
  const gists = useSelector((state: RootState) => state.gists.value);

  const columns: TableColumnsType<Gist> = [
    {
      title: 'Name',
      dataIndex: 'owner',
      render: (owner: Owner) => (
        <div key={owner.id} className="flex max-w-52 justify-between items-center gap-4">
          <Avatar size={50} src={owner.avatar_url} />
          <div>{owner.login}</div>
        </div>
      )
    },
    {
      title: 'Notebook Name',
      dataIndex: 'files',
      render: (files: GistFiles) => (
        <div key={files[Object.keys(files)[0]].filename}>{files[Object.keys(files)[0]].filename}</div>
      )
    },
    {
      title: 'Keyword',
      dataIndex: 'description',
      render: (text: string) => {
        if (!text) return null;
        const keywords = text.split(' ');
        return (
          <div key={text} className="flex justify-center items-center">
            <span className="keyword">{keywords[0]}</span>
          </div>
        );
      }
    },
    {
      title: 'Updated',
      dataIndex: 'updated_at',
      render: (text: string) => <div key={text}>{formatRelativeTime(text)}</div>
    },
    {
      title: '',
      dataIndex: 'id',
      render: (id: string) => (
        <div key={id} className="flex justify-center items-center gap-5">
          <GistStar removeText gistId={id} />
          <GistFork forks={[]} key={id} removeText gistId={id} />
        </div>
      )
    }
  ];

  return (
    <div data-testid="gist-list-layout" className="mt-10">
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: '#EFEFEF'
            }
          }
        }}
      >
        <Table pagination={false} columns={columns} dataSource={gists} />
      </ConfigProvider>
    </div>
  );
};

export default GistListLayout;
