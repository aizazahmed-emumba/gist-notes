import { StarFilled, StarOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { gistAPI } from '../../api/GistAPI';
import { RootState } from '../../store';
import './GistStar.scss';
import { AxiosError } from 'axios';

interface GistStarProps {
  gistId: string;
  removeText?: boolean;
}

const GistStar: React.FC<GistStarProps> = ({ gistId, removeText }) => {
  const [isStarred, setIsStarred] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.userState.user);

  useEffect(() => {
    const fetchStarredStatus = async () => {
      try {
        const res = await gistAPI.get(`/gists/${gistId}/star`);
        if (res.status === 204) {
          setIsStarred(true);
        }
      } catch (err: unknown) {
        console.log(err);
        const error = err as AxiosError;
        if (error.response?.status === 404) {
          setIsStarred(false);
        }
      }
    };
    fetchStarredStatus();
  }, [gistId]);

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
      if (!user) toast.error('Login to star Gist');
      else {
        toast.error('Failed to star Gist');
      }
    }
  };

  return (
    <button onClick={handleStarGist} className="cursor-pointer ">
      {isStarred ? (
        <>
          <StarFilled className="action-icon" /> {!removeText && 'Star'}
        </>
      ) : (
        <>
          <StarOutlined className="action-icon" /> {!removeText && 'Star'}
        </>
      )}
    </button>
  );
};

export default GistStar;
