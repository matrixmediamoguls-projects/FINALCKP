import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

describe('ErrorBoundary', () => {
  // Mock console.error to avoid noise during tests
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('displays error message when child component throws', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument();
  });

  test('shows Try Again button to reset error', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const tryAgainBtn = screen.getByText('Try Again');
    expect(tryAgainBtn).toBeInTheDocument();
  });

  test('Try Again button resets error state', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // After clicking Try Again, if child no longer throws, it should render normally
    const tryAgainBtn = screen.getByText('Try Again');
    fireEvent.click(tryAgainBtn);

    // After reset, render a working component
    rerender(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('Go Home button redirects to home', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    delete window.location;
    window.location = { href: '' };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const goHomeBtn = screen.getByText('Go Home');
    fireEvent.click(goHomeBtn);

    expect(window.location.href).toBe('/');
  });
});
