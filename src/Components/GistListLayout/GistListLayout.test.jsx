import React from 'react';
import { render } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';
import { store } from '../../store';
import GistListLayout from './index';

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

describe('GistListLayout', () => {
  it('renders gists list layout with correct data', () => {
    useSelector.mockReturnValue(mockGists);

    const { getByText } = render(
      <Provider store={store}>
        <GistListLayout />
      </Provider>
    );

    expect(getByText('user1')).toBeInTheDocument();
    expect(getByText('user2')).toBeInTheDocument();
    expect(getByText('Test')).toBeInTheDocument();
    expect(getByText('Another')).toBeInTheDocument();
    expect(getByText('file1.js')).toBeInTheDocument();
    expect(getByText('file2.py')).toBeInTheDocument();
  });
});
