import { render, screen, fireEvent } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
import Navbar from '@/components/navbar'

const mockSession: Session = {
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user'
  },
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
}

function renderNavbar(session: Session | null = null) {
  return render(
    <SessionProvider session={session}>
      <Navbar />
    </SessionProvider>
  )
}

describe('Navbar', () => {
  it('renders logo and navigation links', () => {
    renderNavbar()
    
    expect(screen.getByText('Blog Web')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('shows login link when user is not authenticated', () => {
    renderNavbar()
    
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.queryByText('My Blogs')).not.toBeInTheDocument()
    expect(screen.queryByText('Logout')).not.toBeInTheDocument()
  })

  it('shows my blogs and logout when user is authenticated', () => {
    renderNavbar(mockSession)
    
    expect(screen.getByText('My Blogs')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
  })

  it('toggles mobile menu when menu button is clicked', () => {
    renderNavbar()
    
    const menuButton = screen.getByLabelText('Toggle menu')
    fireEvent.click(menuButton)
    
    const mobileMenu = screen.getByRole('button', { name: 'Close menu' })
    expect(mobileMenu).toBeInTheDocument()
    
    fireEvent.click(mobileMenu)
    
    expect(screen.queryByRole('button', { name: 'Close menu' })).not.toBeInTheDocument()
  })
}) 