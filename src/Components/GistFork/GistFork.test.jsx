import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import GistFork from './index';
import { gistAPI } from '../../API/GistAPI';
import toast from 'react-hot-toast';

jest.mock('react-hot-toast');
jest.mock('../../API/GistAPI');

describe('GistFork', () => {
  it('should fork gist successfully', async () => {
    const mockGistId = 'mock-gist-id';
    const mockPostResponse = { status: 201 };
    gistAPI.post.mockResolvedValue(mockPostResponse);

    const { getByText } = render(<GistFork gistId={mockGistId} />);

    fireEvent.click(getByText('Fork'));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Gist Forked Successfully'));
  });

  it('should handle failure to fork gist', async () => {
    const mockGistId = 'mock-gist-id';
    const mockError = new Error('Failed to fork Gist');
    gistAPI.post.mockRejectedValue(mockError);

    const { getByText } = render(<GistFork gistId={mockGistId} />);

    fireEvent.click(getByText('Fork'));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to fork Gist'));
  });
});
