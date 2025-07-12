import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveValue(value: string | number): R;
      toHaveAttribute(attribute: string, value?: string): R;
      toBeRequired(): R;
      toBeDisabled(): R;
    }
  }
}