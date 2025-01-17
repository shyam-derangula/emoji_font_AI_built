import Link from 'next/link'

export default function FontChangerPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Font Changer</h1>
      <p className="text-xl mb-8">Click the button below to go to the Font Changer website.</p>
      <Link 
        href="/font-changer-app" 
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Open Font Changer
      </Link>
      <Link href="/" className="mt-4 text-blue-500 hover:text-blue-600">
        Back to Emoji Explorer
      </Link>
    </div>
  )
}

