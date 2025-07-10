'use client'

import { useState } from 'react'

interface LinkResultProps {
  slug: string
  originalUrl: string
}

export default function LinkResult({ slug, originalUrl }: LinkResultProps) {
  const [copied, setCopied] = useState(false)
  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }
  
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-green-800">
          Link shortened successfully!
        </h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short URL
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={shortUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Original URL
          </label>
          <p className="text-sm text-gray-600 break-all">
            {originalUrl}
          </p>
        </div>
        
        <div className="flex space-x-4 text-sm">
          <a
            href={`/stats/${slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Analytics →
          </a>
        </div>
      </div>
    </div>
  )
}