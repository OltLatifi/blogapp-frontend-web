import '@testing-library/jest-dom'

if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util')
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder
}

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated'
  })),
  default: jest.fn()
}))

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn()
}))

jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
  v1: () => 'test-uuid'
}))

jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    db: () => ({
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue([])
          })
        }),
        insertOne: jest.fn().mockResolvedValue({ insertedId: '1' }),
        findOne: jest.fn().mockResolvedValue(null),
        findOneAndUpdate: jest.fn().mockResolvedValue({ value: null })
      })
    })
  })
})) 