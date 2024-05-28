import React from 'react';
import { render, waitForElementToBeRemoved, fireEvent } from '@testing-library/react'; // For better assertion messages
import GistPage from './index';
import { Provider, useSelector } from 'react-redux';
import { store } from '../../store';
import { gistAPI } from '../../api/GistAPI';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));
// Mocking toast notifications
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn()
}));

jest.mock('../../api/GistAPI');

// Sample Gist data for testing
const sampleGist = {
  id: 'testGistId',
  owner: { login: 'testUser' },
  forks: [],
  files: {
    'testFile.js': { filename: 'testFile.js', content: 'console.log("Test");', language: 'javascript' }
  }
};

const mockUserState = {
  screenName: 'testUser'
};

describe('GistPage Component', () => {
  // beforeEach(() => {
  //   jest.clearAllMocks();
  // });

  it('renders without crashing', async () => {
    useSelector.mockReturnValue(mockUserState);
    gistAPI.get.mockResolvedValue({ data: sampleGist });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <GistPage />
        </BrowserRouter>
      </Provider>
    );
    await waitForElementToBeRemoved(() => document.querySelector('.ant-spin'));
  });

  it('displays loading spinner when loading', async () => {
    useSelector.mockReturnValue(mockUserState);
    gistAPI.get.mockResolvedValue(new Promise(() => {}));
    const { getByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <GistPage />
        </BrowserRouter>
      </Provider>
    );
    expect(getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders gist details correctly after loading', async () => {
    useSelector.mockReturnValue(mockUserState);
    gistAPI.get.mockResolvedValue({ data: sampleGist });
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <GistPage />
        </BrowserRouter>
      </Provider>
    );
    await waitForElementToBeRemoved(() => document.querySelector('.ant-spin'));
    expect(getByText(sampleGist.files['testFile.js'].filename)).toBeInTheDocument();
  });

  it('displays "Not Found" message when gist is not found', async () => {
    useSelector.mockReturnValue(mockUserState);
    gistAPI.get.mockRejectedValue({ response: { status: 404 } });
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <GistPage />
        </BrowserRouter>
      </Provider>
    );
    await waitForElementToBeRemoved(() => document.querySelector('.ant-spin'));
    expect(getByText('Not Found')).toBeInTheDocument();
  });

  it('renders edit and delete buttons correctly based on user ownership', async () => {
    gistAPI.get.mockResolvedValue({ data: sampleGist });
    useSelector.mockReturnValue(mockUserState);
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <GistPage />
        </BrowserRouter>
      </Provider>
    );
    await waitForElementToBeRemoved(() => document.querySelector('.ant-spin'));
    expect(getByText('Edit')).toBeInTheDocument();
    expect(getByText('Delete')).toBeInTheDocument();
  });

  it('does not render edit and delete buttons when user is not the owner', async () => {
    gistAPI.get.mockResolvedValue({ data: sampleGist });
    useSelector.mockReturnValue({ screenName: 'otherUser' });
    const { queryByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <GistPage />
        </BrowserRouter>
      </Provider>
    );
    await waitForElementToBeRemoved(() => document.querySelector('.ant-spin'));
    const editButton = queryByText('Edit');
    expect(editButton).not.toBeInTheDocument();
    const deleteButton = queryByText('Delete');
    expect(deleteButton).not.toBeInTheDocument();
  });

  it('triggers delete functionality correctly', async () => {
    gistAPI.get.mockResolvedValue({ data: sampleGist });
    useSelector.mockReturnValue(mockUserState);
    gistAPI.delete.mockResolvedValueOnce({ status: 204 });
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <GistPage />
        </BrowserRouter>
      </Provider>
    );
    await waitForElementToBeRemoved(() => document.querySelector('.ant-spin'));
    fireEvent.click(getByText('Delete'));
    expect(gistAPI.delete).toHaveBeenCalledWith('/gists/testGistId');
    // Test if toast success message is displayed
    // Test if navigation function is called with correct argument
  });

  it('renders gist files correctly', async () => {
    useSelector.mockReturnValue(mockUserState);
    gistAPI.get.mockResolvedValue({ data: sampleGist });
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <GistPage />
        </BrowserRouter>
      </Provider>
    );
    await waitForElementToBeRemoved(() => document.querySelector('.ant-spin'));
    expect(getByText('testFile.js')).toBeInTheDocument();
  });
});
