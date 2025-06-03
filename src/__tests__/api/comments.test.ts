import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/comments/create'
import { getServerSession } from 'next-auth'
import getMongoClient from '@/lib/mongodb'

jest.mock('next-auth')
jest.mock('@/lib/mongodb')

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

describe('Comments API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 401 when user is not authenticated', async () => {
    mockGetServerSession.mockResolvedValue(null)
    
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        content: 'Test comment',
        blogId: '1',
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(401)
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Unauthorized',
    })
  })

  it('creates a comment when user is authenticated', async () => {
    mockGetServerSession.mockResolvedValue({
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      },
      expires: new Date().toISOString(),
    })

    const mockComment = {
      _id: '1',
      content: 'Test comment',
      blogId: '1',
      author: '1',
      createdAt: new Date().toISOString(),
    }

    const mockDb = {
      collection: jest.fn().mockReturnValue({
        insertOne: jest.fn().mockResolvedValue({ insertedId: '1' }),
      }),
    }

    ;(getMongoClient as jest.Mock).mockResolvedValue({
      db: () => mockDb,
    })

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        content: 'Test comment',
        blogId: '1',
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(201)
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Comment created successfully',
      commentId: '1',
    })
  })
}) 