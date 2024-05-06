import React, { useState } from "react";
import "./Navbar.scss";
import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { Button, Dropdown, Space, Input, Avatar, MenuProps, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  clearUser,
  setError,
  setLoading,
  setUser,
} from "../../Slices/userSlice";
import { updateAuthToken } from "../../API/GistAPI";
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Navbar2: React.FC = () => {
  const dispatch = useDispatch();

  const [keyowrd, setKeyword] = useState("");
  const { user, loading } = useSelector((state: RootState) => state.userState);
  const navigate = useNavigate();

  const provider = new GithubAuthProvider();
  provider.addScope("gist");
  const auth = getAuth();

  const LoginWithGithub = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        dispatch(setLoading(true));
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential!.accessToken;

        if (!token) return;
        localStorage.setItem("token", token);
        console.log(token);

        const user = result.user as any;
        const { email, photoUrl, screenName } = user.reloadUserInfo;
        localStorage.setItem(
          "user",
          JSON.stringify({ email, photoUrl, screenName })
        );
        dispatch(setUser({ email, photoUrl, screenName }));
        updateAuthToken();
      })
      .catch((error) => {
        dispatch(setError(error));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <div>
          Signed in as <br />{" "}
          <span className="font-semibold">{user?.screenName}</span>
        </div>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: <Link to={"my-gists"}>Your gists</Link>,
      key: "1",
    },
    {
      label: <div>Starred gists</div>,
      key: "3",
    },
    {
      label: <div>Help</div>,
      key: "4",
    },
    {
      type: "divider",
    },
    {
      label: (
        <a href={`https://github.com/${user?.screenName}`}>
          Your Github Profile
        </a>
      ),
      key: "5",
    },
    {
      label: (
        <div
          onClick={() => {
            dispatch(clearUser());
            navigate("/");
          }}
        >
          Sign out
        </div>
      ),
      key: "6",
    },
  ];

  return (
    <div className="nav-container">
      <Link to={"/"}>
        <img src="./EmumbaLogo.png" alt="logo" className="nav-logo" />
      </Link>
      <div className="nav-content">
        <div>
          <Input
            onPressEnter={() => {
              navigate(`/gist/${keyowrd}`);
            }}
            value={keyowrd}
            onChange={(e: any) => setKeyword(e.target.value)}
            addonBefore={<SearchOutlined className="text-white" />}
            classNames={{}}
            style={{
              minWidth: "300px",
            }}
            styles={{
              input: {
                backgroundColor: "transparent",
                color: "white",
                borderLeft: "none",
              },
            }}
            placeholder="Search Gists ..."
            variant="outlined"
            className="nav-search input"
          />
        </div>
        <div className="min-w-20">
          {!loading ? (
            user ? (
              <div className="cursor-pointer">
                <Dropdown
                  menu={{ items }}
                  trigger={["click"]}
                  placement="bottom"
                  arrow
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <Avatar
                        src={user.photoUrl}
                        size={{
                          xs: 24,
                          sm: 25,
                          md: 30,
                          lg: 40,
                          xl: 50,
                          xxl: 60,
                        }}
                      />
                    </Space>
                  </a>
                </Dropdown>
              </div>
            ) : (
              <Button onClick={LoginWithGithub} className="button-nav">
                Login
              </Button>
            )
          ) : (
            <Spin />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar2;
