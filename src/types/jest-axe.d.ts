declare module 'jest-axe' {
  export function toHaveNoViolations(): jest.CustomMatcher;
  export function axe(container: Element): Promise<any>;
}