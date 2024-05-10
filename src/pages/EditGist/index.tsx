import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Input } from 'antd';
import { ErrorMessage, FieldArray, Formik, Form } from 'formik';
import { gistAPI } from '../../api/GistAPI';
import { RootState } from '../../store';
import { Gist } from '../../types/Gist';
import DeleteIcon from '../../components/Icons/DeleteIcon';
import { FileAccType } from '../../types/File';

const EditGistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [gist, setGist] = useState<Gist | null>(null);
  const [Loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userState.user);

  useEffect(() => {
    const fetchGist = async () => {
      try {
        const res = await gistAPI.get(`/gists/${id}`);
        console.log(res.data);
        if (user?.screenName !== res.data.owner.login) {
          toast.error('You are not authorized to Edit this Gist');
          navigate('/');
        } else {
          setGist(res.data);
        }
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.log(err);
        if (err?.response?.status === 401) {
          toast.error('Login to view Gist');
        } else {
          toast.error('Failed to fetch Gist Data');
        }
        navigate('/');
        setLoading(false);
      }
    };
    fetchGist();
  }, [id, navigate, user?.screenName]);

  if (Loading) return <div>Loading...</div>;

  const initialValues = {
    description: gist?.description || '',
    file: gist?.files
      ? Object.keys(gist.files).map((key) => ({
          filename: gist.files[key].filename,
          content: gist.files[key].content,
        }))
      : [{ filename: '', content: '' }],
  };

  return (
    <div className="mt-10">
      <h1 className="text-2xl font-normal">Update Gist</h1>
      <div className="flex justify-center items-center w-full">
        <Formik
          initialValues={initialValues}
          onSubmit={async (values) => {
            console.log(values);
            const files = values.file.reduce((acc: FileAccType, file) => {
              acc[file.filename] = {
                content: file?.content || '',
              };
              return acc;
            }, {});
            Object.keys(gist?.files ?? {}).forEach((filename) => {
              if (!(filename in files)) {
                files[filename] = null;
              }
            });
            try {
              const res = await gistAPI.patch(`/gists/${id}`, {
                description: values.description,
                files,
              });

              console.log(res);
              if (res.status === 200) {
                toast.success('Gist Updated Successfully');
                navigate(`/gist/${  id}`);
              } else {
                toast.error('Failed to update Gist');
              }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
              console.log(err);
              if (err?.response?.data?.message === 'Validation Failed')
                toast.error('Validation Failed. Check your input fields');
              else toast.error('Failed to update Gist');
            }
          }}
        >
          {({ values, handleChange, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit} className="w-1/2 mt-10">
              <div className="flex flex-col gap-4">
                <Input
                  name="description"
                  size="large"
                  type="text"
                  style={{
                    borderColor: '#A3A3A3',
                  }}
                  placeholder="Gist Description"
                  className="input"
                  onChange={handleChange}
                  value={values.description}
                />

                <FieldArray name="file">
                  {({ push, remove }) => (
                    <>
                      {values.file.length > 0 &&
                        values.file.map((_, index) => (
                          <div key={index} className="w-full border flex flex-col">
                            <div className="px-2 py-3 bg-[#FAFAFA] flex justify-start items-center gap-5">
                              <Input
                                name={`file.${index}.filename`}
                                style={{
                                  width: '50%',
                                  backgroundColor: 'transparent',
                                  border: '1px solid #A3A3A3',
                                }}
                                placeholder="Filename including extension"
                                className="input"
                                type="text"
                                size="large"
                                onChange={handleChange}
                                value={values.file[index].filename}
                              />
                              <ErrorMessage
                                name={`file.${index}.filename`}
                                render={(msg) => <div className="text-red-500">{msg}</div>}
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  remove(index);
                                }}
                              >
                                <DeleteIcon />
                              </button>
                            </div>
                            <div>
                              <Input.TextArea
                                name={`file.${index}.content`}
                                placeholder="Gist Content"
                                className="input"
                                size="large"
                                autoSize={{ minRows: 10 }}
                                style={{
                                  border: 'none',
                                }}
                                onChange={handleChange}
                                value={values.file[index].content}
                              />
                            </div>
                            <div />
                          </div>
                        ))}
                      <div className="flex justify-between items-center">
                        <button
                          type="button"
                          onClick={() => {
                            push({});
                          }}
                          className="text-[#003B44] bg-[#c0bfbf] font-medium hover:bg-[#8d8b8b] text-lg rounded-lg  px-5 py-2.5 me-2 mb-2 "
                        >
                          Add file
                        </button>
                        <button disabled={isSubmitting} type="submit" className="button">
                          Update Gist
                        </button>
                      </div>
                    </>
                  )}
                </FieldArray>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditGistPage;
