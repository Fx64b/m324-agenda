/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom'

declare module 'vitest' {
    interface JestAssertion<T = any> extends jest.Matchers<void, T> {}
}
