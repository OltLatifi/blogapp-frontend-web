import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/blogs'
import { getServerSession } from 'next-auth'
import getMongoClient from '@/lib/mongodb'

const mockGetServerSession = jest.mocked(getServerSession)

describe('Blogs API', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    
    it('returns blogs when user is authenticated', async () => {
        mockGetServerSession.mockResolvedValue({
            user: {
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
                role: 'user',
            },
            expires: new Date().toISOString(),
        })

        const mockBlogs = [
            {
                _id: '1',
                title: 'Test Blog',
                content: 'Test Content',
                author: '1',
            },
        ]

        const mockCollection = {
            find: jest.fn().mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    toArray: jest.fn().mockResolvedValue(mockBlogs),
                }),
            }),
        }

        const mockDb = {
            collection: jest.fn().mockReturnValue(mockCollection),
        }

        ;(getMongoClient as jest.Mock).mockResolvedValue({
            db: () => mockDb,
        })

        const { req, res } = createMocks({
            method: 'GET',
        })

        await handler(req, res)

        expect(res._getStatusCode()).toBe(200)
        expect(JSON.parse(res._getData())).toEqual(mockBlogs)
    })
}) 