import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';
import { store } from '../../store';
import { BrowserRouter } from 'react-router-dom';
import GistGridLayout from './GistGridLayout';

const mockGists = [
  {
    id: 'gist1',
    owner: { login: 'user1', avatar_url: 'avatar1.png' },
    created_at: '2024-05-01T12:00:00Z',
    description: 'Test Gist',
    files: { 'file1.js': { filename: 'file1.js' } }
  },
  {
    id: 'gist2',
    owner: { login: 'user2', avatar_url: 'avatar2.png' },
    created_at: '2024-05-02T12:00:00Z',
    description: 'Another Gist',
    files: { 'file2.py': { filename: 'file2.py' } }
  }
];

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

describe('GistGridLayout', () => {
  it('renders gists grid layout with correct data', () => {
    useSelector.mockReturnValue(mockGists);

    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <GistGridLayout />
        </BrowserRouter>
      </Provider>
    );

    expect(getByText('Test Gist')).toBeInTheDocument();
    expect(getByText('Another Gist')).toBeInTheDocument();
  });

  it('takes to gist details page on click', () => {
    useSelector.mockReturnValue(mockGists);

    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <GistGridLayout />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(getByText('Test Gist'));
    expect(window.location.pathname).toBe('/gist/gist1');
  });
});
