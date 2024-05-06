import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Octokit } from "octokit";
import { gistAPI } from "../../API/GistAPI";
import { GitHubUser } from "../../Types/User";

export const  fetchGists = createAsyncThunk('gists/fetchGists', async (pageNumber:number,{rejectWithValue}) => {
    try {const octokit = new Octokit();
    const response = await octokit.request("GET /gists?per_page=9&page="+pageNumber);
    if(response.status === 200) {
        const contentPromises = response.data.map(async (gist: any) => {
            const contentResponse = await axios.get(
              gist.files[Object.keys(gist.files)[0]].raw_url!
            );
            if (typeof contentResponse.data === "object") {
              contentResponse.data = JSON.stringify(contentResponse.data);
            } else {
              contentResponse.data = contentResponse.data
                .split("\n")
                .slice(0, 13)
                .join("\n");
            }
    
            gist.files[Object.keys(gist.files)[0]].content =
              contentResponse.data;
          });
    
          await Promise.all(contentPromises);
    
            return response.data
    }} catch (error) {
        return rejectWithValue(error)

    }
})


export const fetchMyGists = createAsyncThunk('gists/fetchMyGists', async (user:GitHubUser,{rejectWithValue}) => {

  try {

    const response = await gistAPI.get(`/users/${user?.screenName}/gists`);
    if(response.status === 200) {
        const contentPromises = response.data.map(async (gist: any) => {
            const contentResponse = await axios.get(
              gist.files[Object.keys(gist.files)[0]].raw_url!
            );
            if (typeof contentResponse.data === "object") {
              contentResponse.data = JSON.stringify(contentResponse.data);
            } else {
              contentResponse.data = contentResponse.data
                .split("\n")
                .slice(0, 13)
                .join("\n");
            }
    
            gist.files[Object.keys(gist.files)[0]].content =
              contentResponse.data;
          });
    
          await Promise.all(contentPromises);
    
            return response.data
    }} catch (error) {
        return rejectWithValue(error)

    }
})