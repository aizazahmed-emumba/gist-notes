import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Octokit } from 'octokit';
import { gistAPI } from '../../api/GistAPI';
import { GitHubUser } from '../../types/User';
import { ApiGistResult } from '../../types/ApiGistResult';
import { Gist } from '../../types/Gist';

export const fetchGists = createAsyncThunk('gists/fetchGists', async (pageNumber: number, { rejectWithValue }) => {
  try {
    const octokit = new Octokit();
    const response = await octokit.request(`GET /gists?per_page=9&page=${  pageNumber}`);
    if (response.status === 200) {
      console.log(response);
      const linkHeader = response?.headers?.link ?? '';
      const regex = /page=(\d+)>;\s*rel="last"/;
      const match = regex.exec(linkHeader);
      let remainingPages = 1;
      if (match && match.length > 1) {
        remainingPages = parseInt(match[1]);
      } else {
        remainingPages = 1;
      }

      const contentPromises = response.data.map(async (gist: Gist) => {
        const contentResponse = await axios.get(gist.files[Object.keys(gist.files)[0]].raw_url!);
        if (typeof contentResponse.data === 'object') {
          contentResponse.data = JSON.stringify(contentResponse.data);
        } else if (typeof contentResponse.data === 'string') {
          contentResponse.data = contentResponse.data.split('\n').slice(0, 13).join('\n');
        } else {
          contentResponse.data = 'No content found Or cannot Read the file content';
        }

        gist.files[Object.keys(gist.files)[0]].content = contentResponse.data;
      });

      await Promise.all(contentPromises);

      return {
        value: response.data,
        remainingPages,
      } as ApiGistResult;
    }
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const fetchMyGists = createAsyncThunk('gists/fetchMyGists', async (user: GitHubUser, { rejectWithValue }) => {
  try {
    const response = await gistAPI.get(`/users/${user?.screenName}/gists`);
    if (response.status === 200) {
      const contentPromises = response.data.map(async (gist: Gist) => {
        const contentResponse = await axios.get(gist.files[Object.keys(gist.files)[0]].raw_url!);
        if (typeof contentResponse.data === 'object') {
          contentResponse.data = JSON.stringify(contentResponse.data);
        } else {
          contentResponse.data = contentResponse.data.split('\n').slice(0, 13).join('\n');
        }

        gist.files[Object.keys(gist.files)[0]].content = contentResponse.data;
      });

      await Promise.all(contentPromises);

      return response.data as Gist[];
    }
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const fetchStarredGists = createAsyncThunk('gists/fetchStarredGists', async (_, { rejectWithValue }) => {
  try {
    const response = await gistAPI.get(`/gists/starred`);
    if (response.status === 200) {
      const contentPromises = response.data.map(async (gist: Gist) => {
        const contentResponse = await axios.get(gist.files[Object.keys(gist.files)[0]].raw_url!);
        if (typeof contentResponse.data === 'object') {
          contentResponse.data = JSON.stringify(contentResponse.data);
        } else {
          contentResponse.data = contentResponse.data.split('\n').slice(0, 13).join('\n');
        }

        gist.files[Object.keys(gist.files)[0]].content = contentResponse.data;
      });

      await Promise.all(contentPromises);

      return response.data as Gist[];
    }
  } catch (error) {
    return rejectWithValue(error);
  }
});
