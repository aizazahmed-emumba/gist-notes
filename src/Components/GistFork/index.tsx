import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ForkOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { Spin } from 'antd';
import { gistAPI } from '../../api/GistAPI';
import { Fork } from '../../types/Gist';
import { RootState } from '../../store';

interface GistForkProps {
  gistId: string;
  removeText?: boolean;
  white?: boolean;
  forks: Fork[];
  button?: boolean;
}

const Index: React.FC<GistForkProps> = ({ gistId, removeText, white, forks, button }) => {
  const [forked, setForked] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.userState);
  const [loading, setLoading] = useState<boolean>(false);

  const handleForkGist = async () => {
    if (forks.find((fork) => fork.user.login === user?.screenName)) {
      // setForked(true);
      toast.error('You have already forked this gist');
      return;
    }
    if (forked) {
      toast.error('You have already forked this gist');
      return;
    }

    try {
      setLoading(true);
      const res = await gistAPI.post(`/gists/${gistId}/forks`);
      if (res.status === 201) {
        toast.success('Gist Forked Successfully');
        setForked(true);
      }
    } catch (err) {
      console.log(err);
      toast.error('Failed to fork Gist');
    } finally {
      setLoading(false);
    }
  };

  if (!button) {
    return (
      <button onClick={handleForkGist} className="cursor-pointer flex gap-2 ">
        {!loading ? <ForkOutlined className={`${white ? 'action-icon-white' : 'action-icon '}`} /> : <Spin />}
        {!removeText && 'Fork'}
      </button>
    );
  }

  return (
    <button onClick={handleForkGist} className="icon-button-container">
      <div className="icon-container">
        <div className="flex gap-2">
          {!loading ? <ForkOutlined className={`${white ? 'action-icon-white' : 'action-icon '}`} /> : <Spin />}
          {!removeText && 'Fork'}
        </div>
      </div>
      <div className="count-container">{forked ? forks.length + 1 : forks.length}</div>
    </button>
  );
};

export default Index;
