import { notFound } from 'next/navigation'
import { db } from '@/lib/db'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function StatsPage({ params }: PageProps) {
  const { slug } = await params
  
  const link = await db.link.findUnique({
    where: { slug },
    include: {
      clicks: {
        orderBy: { timestamp: 'desc' },
        take: 100, // Only get the last 100 clicks for performance
      },
    },
  })
  
  if (!link) {
    notFound()
  }
  
  // Calculate stats - use clickCount for total (efficient), clicks array for detailed analytics
  const totalClicks = link.clickCount
  const uniqueCountries = new Set(link.clicks.map(click => click.country).filter(Boolean)).size
  const recentClicks = link.clicks.slice(0, 10)
  
  // Country stats
  const countryStats = link.clicks.reduce((acc, click) => {
    if (click.country) {
      acc[click.country] = (acc[click.country] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)
  
  const topCountries = Object.entries(countryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
  
  // Daily stats (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toDateString()
  }).reverse()
  
  const dailyStats = last7Days.map(date => {
    const dayClicks = link.clicks.filter(click => 
      click.timestamp.toDateString() === date
    ).length
    return {
      date: new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      clicks: dayClicks
    }
  })
  
  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics for /{slug}
          </h1>
          <p className="text-gray-600 break-all">
            {link.url}
          </p>
        </div>
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalClicks}</p>
                <p className="text-sm text-gray-600">Total Clicks</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{uniqueCountries}</p>
                <p className="text-sm text-gray-600">Countries</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {link.createdAt.toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">Created</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Daily Activity (Last 7 Days)
            </h2>
            <div className="space-y-3">
              {dailyStats.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{day.date}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${totalClicks > 0 ? (day.clicks / Math.max(...dailyStats.map(d => d.clicks))) * 100 : 0}%`
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">
                      {day.clicks}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Top Countries */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Top Countries
            </h2>
            {topCountries.length > 0 ? (
              <div className="space-y-3">
                {topCountries.map(([country, count], index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{country}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(count / totalClicks) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No country data available yet
              </p>
            )}
          </div>
        </div>
        
        {/* Recent Clicks */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Clicks
          </h2>
          {recentClicks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Country</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {recentClicks.map((click, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {click.timestamp.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {click.country || 'Unknown'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-xs">
                        {click.userAgent || 'Unknown'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No clicks yet
            </p>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New Link
          </a>
        </div>
      </div>
    </div>
  )
}