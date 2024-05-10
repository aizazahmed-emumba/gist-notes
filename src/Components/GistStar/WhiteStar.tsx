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

const WhiteStar: React.FC<GistStarProps> = ({ gistId, removeText }) => {
  const [isStarred, setIsStarred] = useState<boolean>(false);
  const [starCount, setStarCount] = useState<number>(0);
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
        } else {
          toast.error('Failed to fetch starred status');
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
        setStarCount((prevCount) => prevCount - 1);
      } else {
        await gistAPI.put(`/gists/${gistId}/star`);
        setStarCount((prevCount) => prevCount + 1);
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
    <button onClick={handleStarGist} className="icon-button-container">
      <div className="icon-container">
        <div className="flex gap-2">
          {isStarred ? (
            <>
              <StarFilled className="action-icon-white" /> {!removeText && 'Star'}{' '}
            </>
          ) : (
            <>
              <StarOutlined className="action-icon-white" /> {!removeText && 'Star'}
            </>
          )}
        </div>
      </div>
      <div className="count-container">{starCount}</div>
    </button>
  );
};

export default WhiteStar;
