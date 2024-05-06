import { Input } from "antd";
import React from "react";
import { Formik, Form, ErrorMessage, FieldArray } from "formik";
import { useNavigate } from "react-router-dom";

import DeleteIcon from "../../Components/Icons/DeleteIcon";
import { gistAPI } from "../../API/GistAPI";
import toast from "react-hot-toast";

const index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-10">
      <h1 className="text-2xl font-normal">Create Gist</h1>
      <div className="flex justify-center items-center w-full">
        <Formik
          initialValues={{
            description: "",
            file: [{ filename: "", content: "" }],
            content: "",
          }}
          onSubmit={async (values) => {
            try {
              const res = await gistAPI.post("/gists", {
                description: values.description,
                public: true,
                files: values.file.reduce((acc: any, file) => {
                  acc[file.filename] = {
                    content: file.content,
                  };
                  return acc;
                }, {}),
              });

              if (res.status === 201) {
                toast.success("Gist Created Successfully");
              }
              navigate("/gist/" + res.data.id);
            } catch (error: any) {
              console.log(error);
              toast.error("Failed to create Gist");
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
                    borderColor: "#A3A3A3",
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
                          <div className="w-full border flex flex-col">
                            <div className="px-2 py-3 bg-[#FAFAFA] flex justify-start items-center gap-5">
                              <Input
                                name={`file.${index}.filename`}
                                style={{
                                  width: "50%",
                                  backgroundColor: "transparent",
                                  border: "1px solid #A3A3A3",
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
                                render={(msg) => (
                                  <div className="text-red-500">{msg}</div>
                                )}
                              />

                              <button
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
                                  border: "none",
                                }}
                                onChange={handleChange}
                                value={values.file[index].content}
                              />
                            </div>
                            <div></div>
                          </div>
                        ))}
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => {
                            push({});
                          }}
                          className="text-[#003B44] bg-[#c0bfbf] font-medium hover:bg-[#8d8b8b] text-lg rounded-lg  px-5 py-2.5 me-2 mb-2 "
                        >
                          Add file
                        </button>
                        <button
                          disabled={isSubmitting}
                          type="submit"
                          className="button"
                        >
                          Create Gist
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

export default index;
