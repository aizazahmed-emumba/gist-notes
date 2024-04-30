import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface GitHubUser {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string | null;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name: string | null;
    company: string | null;
    blog: string | null;
    location: string | null;
    email: string | null;
    hireable: boolean | null;
    bio: string | null;
    twitter_username: string | null | undefined;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
    private_gists: number | undefined;
    total_private_repos: number | undefined;
    owned_private_repos: number | undefined;
    disk_usage: number | undefined;
    collaborators: number | undefined;
    plan: {
      name: string | undefined;
      space: number | undefined;
      private_repos: number | undefined;
      collaborators: number | undefined;
    };
  }
  
const initialState: GitHubUser  = {
    login: "",
    id: 0,
    node_id: "",
    avatar_url: "",
    gravatar_id: "",
    url: "",
    html_url: "",
    followers_url: "",
    following_url: "",
    gists_url: "",
    starred_url: "",
    subscriptions_url: "",
    organizations_url: "",
    repos_url: "",
    events_url: "",
    received_events_url: "",
    type: "",
    site_admin: false,
    name: "",
    company: "",
    blog: "",
    location: "",
    email: "",
    hireable: false,
    bio: "",
    twitter_username: "",
    public_repos: 0,
    public_gists: 0,
    followers: 0,
    following: 0,
    created_at: "",
    updated_at: "",
    private_gists: 0,
    total_private_repos: 0,
    owned_private_repos: 0,
    disk_usage: 0,
    collaborators: 0,
    plan: {
      name: "",
      space: 0,
      private_repos: 0,
      collaborators: 0,
    },
}
    


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (_, action: PayloadAction<GitHubUser>) => action.payload,
    clearUser: (_) => initialState,
  },
})

// Action creators are generated for each case reducer function
export const { setUser , clearUser } = userSlice.actions

export default userSlice.reducer