// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock Next.js navigation (useSearchParams)
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(() => ({
    get: jest.fn((key) => {
      // Default to returning null, tests can override this
      return null
    }),
  })),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  })),
}))

// Mock Next.js Link component
jest.mock('next/link', () => {
  const React = require('react')
  return function Link({ children, href, className, ...props }) {
    return React.createElement('a', { href, className, ...props }, children)
  }
})

// Mock Next.js Head component
jest.mock('next/head', () => {
  const React = require('react')
  return function Head({ children }) {
    return React.createElement(React.Fragment, null, children)
  }
})

// Mock image imports
jest.mock('../public/transparent-logo.png', () => ({
  __esModule: true,
  default: {
    src: '/transparent-logo.png',
  },
}))

jest.mock('../public/avatar.png', () => ({
  __esModule: true,
  default: {
    src: '/avatar.png',
  },
}))

// Mock @react-pdf/renderer
jest.mock('@react-pdf/renderer', () => ({
  Document: () => null,
  Page: () => null,
  Text: () => null,
  View: () => null,
  StyleSheet: {
    create: () => ({}),
  },
  PDFDownloadLink: () => null,
  renderToStream: jest.fn(),
  renderToBuffer: jest.fn(),
  renderToString: jest.fn(),
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => {
  const React = require('react')
  const createIcon = (name) => (props) => React.createElement('svg', { 'data-testid': `icon-${name.toLowerCase()}`, ...props })
  return {
    HeartIcon: createIcon('HeartIcon'),
    Search: createIcon('Search'),
    Check: createIcon('Check'),
    Pencil: createIcon('Pencil'),
    Plus: createIcon('Plus'),
    ShieldCheck: createIcon('ShieldCheck'),
    ShieldMinus: createIcon('ShieldMinus'),
    ChevronRight: createIcon('ChevronRight'),
    ChevronDown: createIcon('ChevronDown'),
    X: createIcon('X'),
    CheckSquare: createIcon('CheckSquare'),
    Ellipsis: createIcon('Ellipsis'),
    Square: createIcon('Square'),
    SquareArrowUpRight: createIcon('SquareArrowUpRight'),
    Trash2: createIcon('Trash2'),
    ChevronUp: createIcon('ChevronUp'),
    Apple: createIcon('Apple'),
    Calculator: createIcon('Calculator'),
    Table: createIcon('Table'),
    Home: createIcon('Home'),
  }
})

// Mock Supabase client
const createMockQueryBuilder = () => {
  const mockBuilder = {
    eq: jest.fn(() => mockBuilder),
    lte: jest.fn(() => mockBuilder),
    gt: jest.fn(() => mockBuilder),
    order: jest.fn(() => mockBuilder),
    limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
    single: jest.fn(() => Promise.resolve({ data: null, error: null })),
  }
  return mockBuilder
}

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => createMockQueryBuilder()),
      insert: jest.fn(() => Promise.resolve({ error: null })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
        in: jest.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}))

// Mock window.alert
global.alert = jest.fn()

