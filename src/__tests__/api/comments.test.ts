import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/comments/create'
import { getServerSession } from 'next-auth'

global.Request = jest.fn().mockImplementation((input, init) => ({
    ...input,
    ...init,
    headers: new Headers(init?.headers),
    method: init?.method || 'GET',
    url: input
}))

jest.mock('next-auth', () => ({
    getServerSession: jest.fn().mockImplementation(() => Promise.resolve(null))
}))

jest.mock('@/pages/api/auth/[...nextauth]', () => ({
    default: jest.fn(),
    authOptions: {}
}))

jest.mock('@/api/services/Comment', () => ({
    createComment: jest.fn()
}))

const mockGetServerSession = jest.mocked(getServerSession)

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
            error: 'Unauthorized'
        })
    })
}) 