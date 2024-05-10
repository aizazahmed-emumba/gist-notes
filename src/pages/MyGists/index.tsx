import React, { useEffect } from 'react';
import { Avatar, Badge, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { fetchMyGists, fetchStarredGists } from '../../slices/actions';
import GistDescription from '../../components/GistDescription';
import GistStar from '../../components/GistStar';
import GistFork from '../../components/GistFork';
import CodeOutput from '../../components/CodeOutput';
import { Gist } from '../../types/Gist';

const MyGistsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.userState);
  const { error, loading, value } = useSelector((state: RootState) => state.myGists);

  const params = useParams();
  const {gistType} = params;
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      toast.error('Aunothorized');
      navigate('/');
      return;
    }
    if (gistType === 'starred') {
      dispatch(fetchStarredGists());
    } else if (gistType === 'all') {
      dispatch(fetchMyGists(user));
    } else {
      toast.error('Invalid Gist Type');
      navigate('/');
    }
  }, [user?.screenName, gistType, dispatch, navigate, user]);

  return (
    <div className="my-14">
      <div className="grid grid-cols-5">
        <div className="col-span-2 border-r border-gray-300 border-b">
          <div className="flex w-full h-full flex-col justify-start gap-14 items-center">
            <Avatar size={250} src={user?.photoUrl} />
            <h1 className="text-2xl font-bold mt-3">{user?.screenName}</h1>
            <a href={`https://github.com/${user?.screenName}`} className="button w-1/2 text-center text-xl mb-10">
              View Github Profile
            </a>
          </div>
        </div>
        <div className="col-span-3 border-b border-gray-300">
          <div className="flex justify-start items-center gap-1">
            <h1 className="text-2xl font-medium ml-10  ">{gistType === 'starred' ? 'Starred Gists' : 'All Gists'} </h1>
            <Badge count={value.length} style={{ backgroundColor: '#003B44' }} />
          </div>
          <div className="flex flex-col gap-5 justify-center items-center mb-10">
            {loading && (
              <div className="flex justify-center items-center">
                <Spin />
              </div>
            )}
            {error && <h1>{error}</h1>}
            {value.map((gist: Gist) => (
              <div key={gist.id} className="mt-10 w-full px-10">
                <div className="flex justify-between items-center">
                  <div className="max-w-80 overflow-hidden ">
                    <GistDescription gist={gist!} />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-blue-600 flex items-center justify-center gap-1">
                      <GistStar gistId={gist.id} />
                      <div className="value">0</div>
                    </div>
                    <div className="text-blue-600 flex items-center justify-center gap-1">
                      <GistFork forks={gist.forks} gistId={gist.id} />
                      <div className="value">0</div>
                    </div>
                  </div>
                </div>
                <Link to={`/gist/${gist.id}`}>
                  <CodeOutput
                    fileLanguage={gist.files[Object.keys(gist.files)[0]]?.language || 'javascript'}
                    content={gist.files[Object.keys(gist.files)[0]]?.content || ''}
                    filename={gist.files[Object.keys(gist.files)[0]]?.filename}
                    fontSize="0.9rem"
                    height="full"
                    width="full"
                    codeIcon
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyGistsPage;
