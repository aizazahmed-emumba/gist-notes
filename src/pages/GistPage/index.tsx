import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { AxiosError } from 'axios';
import { gistAPI } from '../../api/GistAPI';
import { Gist } from '../../types/Gist';
import GistDescription from '../../components/GistDescription';
import CodeOutput from '../../components/CodeOutput';
import GistStarWhite from '../../components/GistStar/WhiteStar';
import GistFork from '../../components/GistFork';
import './GistPage.scss';
import { RootState } from '../../store';
import { removeGist } from '../../slices/gistsSlice';

const GistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [gist, setGist] = useState<Gist | null>(null);
  const [Loading, setLoading] = useState<boolean>(true);

  const user = useSelector((state: RootState) => state.userState.user);
  const dispatch = useDispatch();

  const navigation = useNavigate();

  useEffect(() => {
    const fetchGist = async () => {
      try {
        const res = await gistAPI.get(`/gists/${id}`);
        console.log(res.data);
        setGist(res.data);
        setLoading(false);
      } catch (err: unknown) {
        if ((err as AxiosError)?.response?.status === 401) {
          toast.error('Login to view Gist');
        } else {
          toast.error('Failed to fetch Gist');
        }

        setLoading(false);
      }
    };
    setLoading(true);
    setGist(null);
    fetchGist();
  }, [id]);

  const handleDeleteGist = async () => {
    try {
      const res = await gistAPI.delete(`/gists/${gist?.id}`);
      if (res.status === 204) {
        toast.success('Gist Deleted Successfully');
        dispatch(removeGist(gist?.id ?? ''));
        navigation('/');
      }
    } catch (err) {
      console.log(err);
      toast.error('Failed to delete Gist');
    }
  };

  if (Loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin />
      </div>
    );

  if (!gist) return <h1>Not Found</h1>;

  return (
    <>
      {Loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : (
        <div className="mt-10">
          <div className="flex justify-between items-center">
            <div>
              <GistDescription gist={gist!} />
            </div>
            <div
              className={`flex ${
                user?.screenName === gist.owner.login ? 'justify-evenly' : 'justify-center'
              } items-center `}
            >
              {user?.screenName === gist.owner.login && (
                <>
                  <Link
                    to={`/edit/${  gist.id}`}
                    className="cursor-pointer mx-2 flex gap-1 items-center w-full justify-center button h-[40px] "
                  >
                    <div>
                      <EditOutlined />
                    </div>
                    <div>Edit </div>
                  </Link>
                  <button
                    onClick={handleDeleteGist}
                    className="cursor-pointer mx-2 flex gap-2 items-center w-full justify-center button h-[40px]"
                  >
                    <div>
                      <DeleteOutlined />
                    </div>
                    <div>Delete</div>
                  </button>
                </>
              )}

              {gist && <GistStarWhite key={gist.id} gistId={gist.id} />}

              <GistFork button white forks={gist.forks} gistId={gist.id} />
            </div>
          </div>

          {Object.keys(gist.files).map((fileName, index) => (
            <div key={index} className="w-full h-full mb-10">
              <CodeOutput
                key={index} // Ensure each component has a unique key
                disableOverlay
                fileLanguage={gist.files[fileName]?.language || 'javascript'}
                lineNumberMargin
                content={gist.files[fileName]?.content || ''}
                filename={gist.files[fileName]?.filename}
                fontSize="0.9rem"
                height="full"
                width="full"
                codeIcon
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default GistPage;
