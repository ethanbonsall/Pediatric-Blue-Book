# Testing Documentation

This document provides information about the testing setup and how to run tests for the Pediatric Blue Book application.

## Overview

The application uses:
- **Jest** as the test runner
- **React Testing Library** for component testing
- **GitHub Actions** for continuous integration

## Running Tests

### Install Dependencies

First, make sure all dependencies are installed:

```bash
cd web
npm install
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

This will generate a coverage report showing which parts of the codebase are covered by tests.

## Test Structure

Tests are located in the `__tests__` directory:

```
web/
  __tests__/
    auth.test.tsx          # Login/logout tests
    formula-admin.test.tsx # Formula add/edit tests
    calculations.test.ts   # Calculation function tests
```

## Test Categories

### 1. Authentication Tests (`auth.test.tsx`)

Tests for login and logout functionality:
- Login form rendering
- Successful login
- Login error handling
- Session management
- Logout functionality

### 2. Formula Admin Tests (`formula-admin.test.tsx`)

Tests for formula management in the admin panel:
- Add new formula (liquid and powder)
- Edit existing formula
- Form validation
- Field type validation (numeric vs text)
- Error handling

### 3. Calculation Tests (`calculations.test.ts`)

Tests for critical calculation functions:
- Nutritional needs calculations
  - Calorie needs (all age groups, activity levels)
  - Holliday-Segar fluid calculation
  - DRI fluid calculation
  - Protein needs calculation
- Formula mix totals calculations
  - Powder formula calculations
  - Liquid formula calculations
  - Water ingredient calculations
  - Mixed formula combinations
- Edge cases
  - Age boundaries
  - Weight boundaries
  - Zero values
  - Very large values
  - Missing data

## Writing New Tests

### Component Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interaction', () => {
    render(<MyComponent />)
    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)
    expect(screen.getByText('Clicked!')).toBeInTheDocument()
  })
})
```

### Calculation Test Example

```typescript
describe('MyCalculation', () => {
  it('should calculate correctly for normal case', () => {
    const result = calculateSomething(10, 20)
    expect(result).toBe(30)
  })

  it('should handle edge case: zero value', () => {
    const result = calculateSomething(0, 20)
    expect(result).toBe(20)
  })

  it('should handle edge case: boundary value', () => {
    const result = calculateSomething(10, 10)
    expect(result).toBe(20)
  })
})
```

## Mocking

### Supabase Mocking

Supabase is automatically mocked in `jest.setup.js`. The mock provides:
- `supabase.auth` methods (getSession, signInWithPassword, signOut, etc.)
- `supabase.from()` for database queries

### Next.js Router Mocking

The Next.js router is automatically mocked. Use it in tests:

```typescript
import { useRouter } from 'next/router'

// Router is already mocked in jest.setup.js
```

## Continuous Integration

Tests run automatically on every commit and pull request via GitHub Actions. The workflow:

1. Checks out code
2. Sets up Node.js
3. Installs dependencies
4. Runs linter
5. Runs tests with coverage
6. Uploads coverage reports

See `.github/workflows/test.yml` for details.


## Troubleshooting

### Tests Not Running

1. Make sure dependencies are installed: `npm install`
2. Check that Jest is installed: `npm list jest`
3. Verify Jest config: `jest --showConfig`

### Import Errors

If you see import errors:
1. Check that `@/` path aliases are set up correctly in `jest.config.js`
2. Verify `tsconfig.json` has matching path mappings

### Mock Issues

If mocks aren't working:
1. Check `jest.setup.js` for mock definitions
2. Ensure mocks are cleared between tests: `jest.clearAllMocks()`

## Best Practices

1. **Test behavior, not implementation**: Focus on what the component/function does, not how it does it
2. **Use descriptive test names**: Test names should clearly describe what is being tested
3. **Test edge cases**: Include boundary conditions, zero values, and error cases
4. **Keep tests isolated**: Each test should be independent and not rely on other tests
5. **Mock external dependencies**: Mock Supabase, API calls, and other external services
6. **Test user interactions**: Use React Testing Library's user-centric queries

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Next.js Testing](https://nextjs.org/docs/testing)

