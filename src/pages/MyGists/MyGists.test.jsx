import React from 'react';
import { render } from '@testing-library/react';
import MyGists from './index';
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

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useSearchParams: () => [new URLSearchParams({ ids: '001,002' })],
  }));

const mockAppState = {
  userState: {
    user: {
      email: 'aaizaz100@gmail.com',
      photoUrl: 'https://avatars.githubusercontent.com/u/166382580?v=4',
      screenName: 'aizazahmed-emumba'
    },
    loading: false,
    error: null
  },
  myGists: {
    loading: false,
    error: null,
    value: [
      {
        id: '1',
        description: 'Test Gist 1',
        owner: {
          login: 'aizazahmed-emumba',
          avatar_url: 'https://avatars.githubusercontent.com/u/166382580?v=4'
        },
        files: {
          'Potential Maintainers': {
            filename: 'Potential Maintainers',
            type: 'text/plain',
            language: null,
            raw_url:
              'https://gist.githubusercontent.com/aizazahmed-emumba/30d9dc0cab03be49d023a797999e074e/raw/2d1bc2d02ebb71e728a7bcf74b8fae61ec2a4d98/Potential%20Maintainers',
            size: 61,
            content: 'Maintainers:\nveprbl: nlojet, nlojet, nlojet, nlojet\n\n//update'
          }
        }
      }
    ]
  }
};

describe('MyGistPage', () => {
  beforeEach(() => {
    useSelector.mockImplementation((callback) => {
      return callback(mockAppState);
    });
  });
  it('should render without crashing', () => {
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MyGists />
        </BrowserRouter>
      </Provider>
    );

    expect(getByText('All Gists')).toBeInTheDocument();
    expect(getByText('Test Gist 1')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    useSelector.mockImplementation((callback) => {
      return callback({
        ...mockAppState,
        myGists: {
          ...mockAppState.myGists,
          loading: true
        }
      });
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MyGists />
        </BrowserRouter>
      </Provider>
    );

    expect(getByTestId('loading')).toBeInTheDocument();
  });

  it('shows correct user info', () => {
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MyGists />
        </BrowserRouter>
      </Provider>
    );
    expect(getByText('aizazahmed-emumba')).toBeInTheDocument();
  });

  it('redirects to Home page if user is not logged in', () => {
    useSelector.mockImplementation((callback) => {
      return callback({
        ...mockAppState,
        userState: {
          ...mockAppState.userState,
          user: null
        }
      });
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <MyGists />
        </BrowserRouter>
      </Provider>
    );

    expect(window.location.pathname).toBe('/');
  });

  
});
