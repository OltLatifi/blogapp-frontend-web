import { render, screen } from '@testing-library/react'
import Hero from '@/components/home/hero'

describe('Hero', () => {
    it('renders the hero section with correct content', () => {
        render(<Hero />)

        const heading = screen.getByRole('heading', { level: 1 })
        const paragraph = screen.getByText(/Ideas, trends, and inspiration for a brighter future/i)

        expect(heading).toBeInTheDocument()
        expect(heading).toHaveTextContent('Exploring New Articles')
        expect(paragraph).toBeInTheDocument()
    })

    it('has correct styling classes', () => {
        const { container } = render(<Hero />)
        const section = container.firstChild

        expect(section).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'min-h-[30vh]', 'w-full', 'bg-white')
    })

    it('renders heading with correct styling', () => {
        render(<Hero />)
        const heading = screen.getByRole('heading', { level: 1 })

        expect(heading).toHaveClass('text-4xl', 'font-bold', 'text-center', 'text-gray-900')
    })

    it('renders paragraph with correct styling', () => {
        render(<Hero />)
        const paragraph = screen.getByText(/Ideas, trends, and inspiration for a brighter future/i)

        expect(paragraph).toHaveClass('text-xl', 'font-normal', 'mt-2', 'text-center', 'text-gray-900')
    })
})