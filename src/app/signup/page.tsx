import EnhancedSignupForm from '@/components/auth/EnhancedSignupForm'
import AuthGuard from '@/components/auth/AuthGuard'

export default function SignupPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex">
        <EnhancedSignupForm />
      </div>
    </AuthGuard>
  )
}