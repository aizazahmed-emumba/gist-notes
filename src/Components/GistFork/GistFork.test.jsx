import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import GistFork from './index';
import { gistAPI } from '../../api/GistAPI';
import toast from 'react-hot-toast';
import { Provider, useSelector } from 'react-redux';
import { store } from '../../store';

jest.mock('react-hot-toast');
jest.mock('../../API/GistAPI');
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

const mockUserState = {
  user: { screenName: 'test-user' },
  loading: false,
  error: null
};

describe('GistFork', () => {
  it('should fork gist successfully', async () => {
    const mockGistId = 'mock-gist-id';
    const mockPostResponse = { status: 201 };
    gistAPI.post.mockResolvedValue(mockPostResponse);
    useSelector.mockReturnValue({ screenName: 'test-user' });

    const { getByText } = render(
      <Provider store={store}>
        <GistFork gistId={mockGistId} forks={[]} />
      </Provider>
    );

    fireEvent.click(getByText('Fork'));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Gist Forked Successfully'));
  });

  it('should handle failure to fork gist', async () => {
    const mockGistId = 'mock-gist-id';
    const mockPostResponse = { status: 201 };
    gistAPI.post.mockResolvedValue(mockPostResponse);
    useSelector.mockReturnValue(mockUserState);

    const { getByText } = render(
      <Provider store={store}>
        <GistFork gistId={mockGistId} forks={[{ user: { login: 'test-user' } }]} />
      </Provider>
    );

    fireEvent.click(getByText('Fork'));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('You have already forked this gist'));
  });

  it('should not let user fork gist if the user has clicked on fork button', async () => {
    const mockGistId = 'mock-gist-id';
    const mockPostResponse = { status: 201 };
    gistAPI.post.mockResolvedValue(mockPostResponse);
    useSelector.mockReturnValue(mockUserState);

    const { getByText } = render(
      <Provider store={store}>
        <GistFork gistId={mockGistId} forks={[]} />
      </Provider>
    );

    fireEvent.click(getByText('Fork'));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Gist Forked Successfully'));

    fireEvent.click(getByText('Fork'));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('You have already forked this gist'));
  });
});
