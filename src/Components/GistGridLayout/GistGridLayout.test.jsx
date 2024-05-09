import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store';
import GistGridLayout from './GistGridLayout';

// Mock gists data for testing
const mockGists = [
  {
    id: 'gist1',
    files: {
      'file1.js': { content: 'console.log("Hello, World!")', language: 'javascript' },
    },
  },
  {
    id: 'gist2',
    files: {
      'file2.py': { content: 'print("Hello, World!")', language: 'python' },
    },
  },
];

// Mock RootState with gists data
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('GistGridLayout', () => {
  it('renders gists grid layout with correct data', () => {
    useSelector.mockReturnValueOnce(mockGists); 

    const { getAllByText, getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <GistGridLayout />
        </MemoryRouter>
      </Provider>
    );

   
    expect(getAllByText(/file\d\.(js|py)/i).length).toBe(2);

    const linkElements = document.querySelectorAll('a[href^="/gist/"]');
    expect(linkElements.length).toBe(2);

    expect(getByText('console.log("Hello, World!")')).toBeInTheDocument();
    expect(getByText('print("Hello, World!")')).toBeInTheDocument();
  });
});
