import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import GistDescription from './index';

describe('GistDescription', () => {
  const gist = {
    owner: {
      avatar_url: 'https://example.com/avatar.png',
      login: 'testUser',
    },
    files: {
      exampleFile: { filename: 'exampleFile.txt' },
    },
    created_at: new Date().toString(),
    description: 'Test description',
  };

  it('renders correctly', () => {
    const { getByText } = render(<GistDescription gist={gist} />);

    expect(getByText(`testUser / exampleFile.txt`)).toBeInTheDocument();
    expect(getByText('Test description')).toBeInTheDocument();
  });
});
