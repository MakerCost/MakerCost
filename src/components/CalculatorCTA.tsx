import Link from 'next/link'

interface CalculatorCTAProps {
  headline?: string
  description?: string
}

export default function CalculatorCTA({ 
  headline = "Ready to Calculate Your Pricing?", 
  description = "Use our professional calculator to determine the optimal pricing for your products and maximize your profits." 
}: CalculatorCTAProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white my-8">
      <h3 className="text-2xl font-bold mb-4">{headline}</h3>
      <p className="text-lg mb-6 opacity-90">
        {description}
      </p>
      <Link 
        href="/"
        className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
      >
        Try MakerCost Calculator →
      </Link>
    </div>
  )
}