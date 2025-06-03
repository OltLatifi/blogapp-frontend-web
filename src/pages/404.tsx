import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'

const NotFoundPage = () => {
  const router = useRouter()

  const handleReturnHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          onClick={handleReturnHome}
          size="lg"
          className="mt-4"
        >
          Return Home
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage 