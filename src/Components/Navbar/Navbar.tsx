import React, { useEffect, useState } from "react";
import "./Navbar.scss";
import { Input, Button, Dropdown, Space, MenuProps, Spin } from "antd";
import axios from "axios";
import { Avatar } from "antd";
import { Octokit } from "octokit";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { GitHubUser, setUser } from "../../Slices/userSlice";
import toast from "react-hot-toast";

const CLIENT_ID = "1a00915440d6d7464e5b";

const Navbar: React.FC = () => {
  const [keyowrd, setKeyword] = useState("");
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const getAuthenticatedUser = async () => {
    try {
      setLoading(true);
      const octokit = new Octokit({
        auth: localStorage.getItem("token"),
      });

      const response = await octokit.request("GET /user", {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          accept: "application/vnd.github.v3+json",
        },
      });

      if (response.status !== 200) return console.log("Error");

      const responseUser: GitHubUser = {
        login: response.data.login,
        id: response.data.id,
        node_id: response.data.node_id,
        avatar_url: response.data.avatar_url,
        gravatar_id: response.data.gravatar_id,
        url: response.data.url,
        html_url: response.data.html_url,
        followers_url: response.data.followers_url,
        following_url: response.data.following_url,
        gists_url: response.data.gists_url,
        starred_url: response.data.starred_url,
        subscriptions_url: response.data.subscriptions_url,
        organizations_url: response.data.organizations_url,
        repos_url: response.data.repos_url,
        events_url: response.data.events_url,
        received_events_url: response.data.received_events_url,
        type: response.data.type,
        site_admin: response.data.site_admin,
        name: response.data.name,
        company: response.data.company,
        blog: response.data.blog,
        location: response.data.location,
        email: response.data.email,
        hireable: response.data.hireable,
        bio: response.data.bio,
        twitter_username: response.data.twitter_username,
        public_repos: response.data.public_repos,
        public_gists: response.data.public_gists,
        followers: response.data.followers,
        following: response.data.following,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
        private_gists: response.data.private_gists,
        total_private_repos: response.data.total_private_repos,
        owned_private_repos: response.data.owned_private_repos,
        disk_usage: response.data.disk_usage,
        collaborators: response.data.collaborators,
        plan: {
          name: response?.data?.plan?.name,
          space: response?.data?.plan?.space,
          private_repos: response?.data?.plan?.private_repos,
          collaborators: response?.data?.plan?.collaborators,
        },
      };
      dispatch(setUser(responseUser));
    } catch (error) {
      console.log(error);
      toast.error("Failed to get user");
    } finally {
      console.log("Done");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getAuthenticatedUser();
    } else {
      const getAccessToken = async (code: string) => {
        try {
          const response = await axios.get(
            "http://localhost:5000/getAccessToken",
            {
              params: {
                code: code,
              },
            }
          );

          console.log(response);
          if (response.status === 200)
            localStorage.setItem("token", response.data.access_token);
        } catch (error) {
          console.log(error + "Failed to get access token");
          toast.error("Failed to get access token");
        }
      };

      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        getAccessToken(code);
      }
    }
  }, []);

  const LoginWithGithub = () => {
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=gist%20user`
    );
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <div>
          Signed in as <br />{" "}
          <span className="font-semibold">{user?.login}</span>
        </div>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: <div>Your gists</div>,
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
      label: <a href={user?.html_url}>Your Github Profile</a>,
      key: "5",
    },
    {
      label: <div>Sign out</div>,
      key: "6",
    },
  ];

  return (
    <div className="nav-container">
      <div>
        <img src="./EmumbaLogo.png" alt="logo" className="nav-logo" />
      </div>
      <div className="nav-content">
        <div>
          <Input.Search
            value={keyowrd}
            onChange={(e: any) => setKeyword(e.target.value)}
            loading={false}
            classNames={{}}
            style={{
              minWidth: "300px",
            }}
            styles={{
              input: {
                backgroundColor: "transparent",
                color: "white",
                borderRight: "none",
              },
            }}
            placeholder="Search"
            variant="outlined"
            className="nav-search input"
          />
        </div>
        <div className="min-w-20">
          {!loading ? (
            user?.id ? (
              <div className="cursor-pointer">
                <Dropdown
                  menu={{ items }}
                  trigger={["click"]}
                  placement="bottomCenter"
                  arrow
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <Avatar
                        src={user.avatar_url}
                        size={{
                          xs: 24,
                          sm: 25,
                          md: 30,
                          lg: 40,
                          xl: 50,
                          xxl: 80,
                        }}
                      />
                    </Space>
                  </a>
                </Dropdown>
              </div>
            ) : (
              <Button onClick={LoginWithGithub} className="button">
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

export default Navbar;
