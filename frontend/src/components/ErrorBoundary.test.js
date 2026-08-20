// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  // React logs the caught error to console.error; silence it so the run stays readable.
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Test Content')).toBeTruthy();
  });

  it('displays the fallback when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText(/unexpected error occurred/i)).toBeTruthy();
  });

  it('offers a Try Again control on the fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Try Again')).toBeTruthy();
  });

  it('recovers once Try Again is pressed and the child stops throwing', () => {
    let shouldThrow = true;
    const MaybeThrow = () => {
      if (shouldThrow) throw new Error('Test error');
      return <div>Test Content</div>;
    };

    render(
      <ErrorBoundary>
        <MaybeThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeTruthy();

    // Clear the fault before resetting, otherwise the retry re-throws
    // immediately and the boundary correctly stays in its error state.
    shouldThrow = false;
    fireEvent.click(screen.getByText('Try Again'));

    expect(screen.getByText('Test Content')).toBeTruthy();
  });

  it('sends the user home when Go Home is pressed', () => {
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { href: '' },
    });

    try {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      fireEvent.click(screen.getByText('Go Home'));

      expect(window.location.href).toBe('/');
    } finally {
      Object.defineProperty(window, 'location', {
        configurable: true,
        writable: true,
        value: originalLocation,
      });
    }
  });
});
