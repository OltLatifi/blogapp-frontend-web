import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { CommentSection } from '@/components/comments/CommentSection'
import { Session } from 'next-auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { commentService } from '@/services/commentService'

jest.mock('@/services/commentService', () => ({
  commentService: {
    getByBlogId: jest.fn(),
    create: jest.fn(),
  },
}))

const mockSession: Session = {
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
  },
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

function renderCommentSection(session: Session | null = null) {
  return render(
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <CommentSection blogId="1" />
      </SessionProvider>
    </QueryClientProvider>
  )
}

describe('CommentSection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(commentService.getByBlogId as jest.Mock).mockResolvedValue([])
    ;(commentService.create as jest.Mock).mockResolvedValue({ id: '1', content: 'New test comment' })
  })

  it('renders comment section', async () => {
    renderCommentSection(mockSession)
    
    expect(screen.getByText('Loading comments...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Write a comment...')).toBeInTheDocument()
    })
  })

  it('shows comment form when user is authenticated', async () => {
    renderCommentSection(mockSession)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Write a comment...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Post' })).toBeInTheDocument()
    })
  })

  it('shows login message when user is not authenticated', async () => {
    renderCommentSection(null)
    
    await waitFor(() => {
      expect(screen.getByText('Please login to comment')).toBeInTheDocument()
      expect(screen.queryByPlaceholderText('Write a comment...')).not.toBeInTheDocument()
    })
  })

  it('allows submitting a new comment', async () => {
    renderCommentSection(mockSession)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Write a comment...')).toBeInTheDocument()
    })
    
    const commentInput = screen.getByPlaceholderText('Write a comment...')
    const submitButton = screen.getByRole('button', { name: 'Post' })
    
    fireEvent.change(commentInput, { target: { value: 'New test comment' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(commentService.create).toHaveBeenCalledWith({
        blogId: '1',
        content: 'New test comment',
        userId: mockSession.user.id
      })
    })
  })
}) 