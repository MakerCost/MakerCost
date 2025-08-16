import MondayStyleLoginForm from '@/components/auth/MondayStyleLoginForm'
import AuthGuard from '@/components/auth/AuthGuard'

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex">
        <MondayStyleLoginForm />
      </div>
    </AuthGuard>
  )
}