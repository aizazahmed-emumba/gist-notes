import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar2 from './Navbar2';
import { signInWithPopup } from 'firebase/auth';
import { store } from '../../store';

// Mock functions
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithPopup: jest.fn(),
  GithubAuthProvider: jest.fn().mockImplementation(() => ({
    addScope: jest.fn()
  }))
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
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
  }
};

describe('Navbar2', () => {
  beforeEach(() => {
    useSelector.mockImplementation((callback) => {
      return callback(mockAppState);
    });
  });

  it('should render the Navbar with Login button when user is not logged in', () => {
    useSelector.mockImplementation((callback) => {
      return callback({
        userState: {
          user: null,
          loading: false,
          error: null
        }
      });
    });
    render(
      <Provider store={store}>
        <Router>
          <Navbar2 />
        </Router>
      </Provider>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('should render the Navbar with user avatar when user is logged in', () => {
    render(
      <Provider store={store}>
        <Router>
          <Navbar2 />
        </Router>
      </Provider>
    );

    const avatar = screen.getByTestId('avatar');
    fireEvent.click(avatar);

    expect(screen.getByText('aizazahmed-emumba')).toBeInTheDocument();
  });

  it('should display loading spinner when loading is true', () => {
    useSelector.mockImplementation((callback) => {
      return callback({
        userState: {
          user: null,
          loading: true,
          error: null
        }
      });
    });

    render(
      <Provider store={store}>
        <Router>
          <Navbar2 />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should navigate to the correct gist when pressing Enter in the search input', () => {
    render(
      <Provider store={store}>
        <Router>
          <Navbar2 />
        </Router>
      </Provider>
    );

    const input = screen.getByPlaceholderText('Search Gists ...');
    fireEvent.change(input, { target: { value: 'some-keyword' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Check if the navigation happened to the correct path
    expect(window.location.pathname).toBe('/gist/some-keyword');
  });

  it('should call LoginWithGithub on login button click', async () => {
    useSelector.mockImplementation((callback) => {
      return callback({
        userState: {
          user: null,
          loading: false,
          error: null
        }
      });
    });

    signInWithPopup.mockResolvedValue({
      user: {
        reloadUserInfo: {
          email: 'test@example.com',
          photoUrl: 'https://example.com/avatar.jpg',
          screenName: 'testuser'
        }
      },
      credential: {
        accessToken: 'mock-token'
      }
    });

    render(
      <Provider store={store}>
        <Router>
          <Navbar2 />
        </Router>
      </Provider>
    );

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    expect(signInWithPopup).toHaveBeenCalled();
  });
});
