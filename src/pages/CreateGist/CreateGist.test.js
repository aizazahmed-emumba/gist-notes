import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateGistPage from './index';
import { gistAPI } from '../../api/GistAPI';
import toast from 'react-hot-toast';

// Mocking the react-router-dom's useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

jest.mock('../../api/GistAPI');

// Mocking react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn()
}));

jest.mock('../../api/GistAPI');

describe('CreateGistPage component', () => {
  it('renders without crashing', () => {
    render(<CreateGistPage />);
  });

  it('submits form and creates gist successfully', async () => {
    const mockPostResponse = { status: 201, data: { id: 'test-gist-id' } };
    gistAPI.post.mockResolvedValue(mockPostResponse);
    render(<CreateGistPage />);

    // Fill in the description field
    fireEvent.change(screen.getByPlaceholderText('Gist Description'), {
      target: { value: 'Test Gist Description' }
    });

    // Fill in the filename and content fields
    fireEvent.change(screen.getByPlaceholderText('Filename including extension'), {
      target: { value: 'test-file.txt' }
    });

    fireEvent.change(screen.getByPlaceholderText('Gist Content'), {
      target: { value: 'Test Gist Content' }
    });

    // Click "Create Gist" button

    fireEvent.click(screen.getByRole('button', { name: 'Create Gist' }));

    // Wait for the success toast message
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Gist Created Successfully'));
  });

  it('handles form submission failure', async () => {
    // Mocking API call to return an error
    // gistAPI.post("/gists'").mockImplementation(() => Promise.reject(new Error('Failed to create Gist')));

    const mockPostErrorResponse = new Error('Failed to create Gist');
    gistAPI.post.mockResolvedValue(mockPostErrorResponse);

    render(<CreateGistPage />);

    // Fill in the description field
    fireEvent.change(screen.getByPlaceholderText('Gist Description'), {
      target: { value: 'Test Gist Description' }
    });

    // Fill in the filename and content fields
    fireEvent.change(screen.getByPlaceholderText('Filename including extension'), {
      target: { value: 'test-file.txt' }
    });

    fireEvent.change(screen.getByPlaceholderText('Gist Content'), {
      target: { value: 'Test Gist Content' }
    });

    // Click "Create Gist" button
    fireEvent.click(screen.getByRole('button', { name: 'Create Gist' }));

    // Wait for the error toast message
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to create Gist'));
  });
});
