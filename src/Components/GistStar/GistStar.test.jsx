import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import GistStar from './index';
import { gistAPI } from '../../api/GistAPI';
import toast from 'react-hot-toast';
import { Provider, useSelector } from 'react-redux';
import { store } from '../../store';

jest.mock('react-hot-toast');
jest.mock('../../API/GistAPI');
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe('GistStar', () => {
  beforeEach(() => {
    useSelector.mockReturnValue({
      userState: {
        user: {
          screenName: 'test-user',
          email: 'aaizaz100@gmail.com',
          photoUrl: 'https://avatars.githubusercontent.com/u/4726921?v=4',
        },
      },
    });
  });
  it('should star gist successfully', async () => {
    const mockGistId = 'mock-gist-id';
    const mockPutResponse = { status: 204 };
    const mockGetResponse = { status: 200 };
    gistAPI.get.mockResolvedValue(mockGetResponse);
    gistAPI.put.mockResolvedValue(mockPutResponse);

    const { getByText } = render(<GistStar gistId={mockGistId} />);

    fireEvent.click(getByText('Star'));

    await waitFor(() => expect(gistAPI.put).toHaveBeenCalledWith(`/gists/${mockGistId}/star`));
  });

  it('should handle failure to star gist', async () => {
    const mockGistId = 'mock-gist-id';
    const mockGetResponse = { status: 200 };
    gistAPI.get.mockResolvedValue(mockGetResponse);
    const mockError = new Error('Failed to star Gist');
    gistAPI.put.mockRejectedValue(mockError);

    const { getByText } = render(
      <Provider store={store}>
        <GistStar gistId={mockGistId} />
      </Provider>,
    );
    fireEvent.click(getByText('Star'));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to star Gist'));
  });
});
