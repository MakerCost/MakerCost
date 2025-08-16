import Link from 'next/link'

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Check your email
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            We&apos;ve sent a confirmation link to your email address.
          </p>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Next steps:
            </h3>
            <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
              <li>Check your email inbox (including spam folder)</li>
              <li>Click the confirmation link in the email</li>
              <li>You&apos;ll be redirected back to MakerCost</li>
            </ol>
          </div>
          
          <div className="mt-6 space-y-4">
            <p className="text-xs text-gray-500">
              Didn&apos;t receive the email? Check your spam folder or{' '}
              <Link href="/signup" className="text-blue-600 hover:underline cursor-pointer">
                try signing up again
              </Link>
            </p>
            
            <div className="pt-4 border-t border-gray-200">
              <Link 
                href="/"
                className="text-blue-600 hover:underline text-sm cursor-pointer"
              >
                ← Back to MakerCost
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}