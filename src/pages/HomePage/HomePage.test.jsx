import React from 'react';
import { render, fireEvent } from '@testing-library/react'; // For better assertion messages
import HomePage from './index';
import { Provider, useSelector } from 'react-redux';
import { store } from '../../store';
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

const mockAppState = {
  userState: {
    user: {
      email: 'aizaz.ahmed@emumba.com',
      photoUrl: 'https://avatars.githubusercontent.com/u/166382580?v=4',
      screenName: 'aizazahmed-emumba'
    },
    loading: false,
    error: null
  },
  gists: {
    totalPages: 300,
    value: [
      {
        id: '1',
        description: 'Test Gist 1',
        owner: {
          login: 'aizazahmed-emumba',
          avatar_url: 'https://avatars.githubusercontent.com/u/166382580?v=4'
        },
        files: {
          'test1.txt': {
            filename: 'test1.txt',
            type: 'text/plain',
            language: 'Text',
            raw_url: 'https://gist.githubusercontent.com/aizazahmed-emumba/1/raw/test1.txt',
            size: 100
          }
        },
        created_at: '2021-01-01T00:00:00Z',
        updated_at: '2021-01-01T00:00:00Z',
        comments: 0,
        html_url: 'https://gist.github.com/aizazahmed-emumba/1'
      },
      {
        id: '2',
        description: 'Test Gist 2',
        owner: {
          login: 'aizazahmed-emumba',
          avatar_url: 'https://avatars.githubusercontent.com/u/166382580?v=4'
        },
        files: {
          'test2.txt': {
            filename: 'test2.txt',
            type: 'text/plain',
            language: 'Text',
            raw_url: 'https://gist.githubusercontent.com/aizazahmed-emumba/2/raw/test2.txt',
            size: 200
          }
        },
        created_at: '2021-01-01T00:00:00Z',
        updated_at: '2021-01-01T00:00:00Z',
        comments: 0,
        html_url: 'https://gist.github.com/aizazahmed-emumba/2'
      }
    ],
    loading: false,
    error: null
  },
  myGists: {
    value: [],
    loading: false,
    error: null
  }
};

describe('GistPage Component', () => {
  beforeEach(() => {
    useSelector.mockImplementation((callback) => {
      return callback(mockAppState);
    });
  });

  afterEach(() => {
    useSelector.mockClear();
  });

  it('renders without crashing', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </Provider>
    );

    expect(getByText('Public Gists')).toBeInTheDocument();
  });

  it('displays loading spinner when loading', async () => {
    const localMockAppState = {
      ...mockAppState,
      gists: {
        ...mockAppState.gists,
        loading: true
      }
    };
    useSelector.mockImplementation((callback) => {
      return callback(localMockAppState);
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </Provider>
    );
    expect(getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('switches between grid and list layouts', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </Provider>
    );

    const gridLayoutButton = getByTestId('grid-layout-button');
    const listLayoutButton = getByTestId('list-layout-button');

    fireEvent.click(listLayoutButton);
    expect(getByTestId('gist-list-layout')).toBeInTheDocument();

    fireEvent.click(gridLayoutButton);
    expect(getByTestId('gist-grid-layout')).toBeInTheDocument();
  });

  it('Takes user to Gist details page', () => {
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </Provider>
    );

    const gistCard = getByText('test2.txt');
    fireEvent.click(gistCard);
    expect(window.location.pathname).toBe('/gist/2');
  });
});
