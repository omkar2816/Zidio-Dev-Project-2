import { useState, useEffect } from "react"

const AnalyticsChart = ({ data, type, title, color = "blue" }) => {
  const [maxValue, setMaxValue] = useState(0)

  useEffect(() => {
    if (data && data.length > 0) {
      const max = Math.max(...data.map(item => item.count || item.value || 0))
      setMaxValue(max)
    }
  }, [data])

  const getBarHeight = (value) => {
    if (maxValue === 0) return 0
    return (value / maxValue) * 100
  }

  const colorClasses = {
    blue: {
      bg: 'bg-blue-500',
      light: 'bg-blue-200',
      text: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-500',
      light: 'bg-green-200', 
      text: 'text-green-600'
    },
    purple: {
      bg: 'bg-purple-500',
      light: 'bg-purple-200',
      text: 'text-purple-600'
    },
    orange: {
      bg: 'bg-orange-500',
      light: 'bg-orange-200',
      text: 'text-orange-600'
    }
  }

  const colors = colorClasses[color] || colorClasses.blue

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center text-gray-500 py-8">
          No data available
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${colors.text}`}>
        {title}
      </h3>
      
      {type === 'bar' && (
        <div className="space-y-3">
          {data.slice(-10).map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 min-w-0 flex-1 truncate">
                {item.label || item._id || `Item ${index + 1}`}
              </span>
              <div className="flex items-center space-x-2 flex-1 max-w-xs">
                <div className="flex-1 bg-gray-200 rounded-full h-2 ml-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${colors.bg}`}
                    style={{ width: `${getBarHeight(item.count || item.value)}%` }}
                  ></div>
                </div>
                <span className={`text-sm font-medium ${colors.text} min-w-0`}>
                  {item.count || item.value || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {type === 'line' && (
        <div className="relative">
          <div className="flex items-end justify-between space-x-1 h-32">
            {data.slice(-7).map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="relative bg-gray-100 rounded-t w-full flex items-end justify-center min-h-0" style={{ height: '120px' }}>
                  <div
                    className={`${colors.bg} rounded-t w-full transition-all duration-500 flex items-end justify-center`}
                    style={{ height: `${getBarHeight(item.count || item.value)}%` }}
                  >
                    <span className="text-xs text-white font-medium mb-1">
                      {item.count || item.value || 0}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-1 text-center">
                  {new Date(item._id || item.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {type === 'pie' && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              {/* Simple pie visualization */}
              <div className={`w-full h-full rounded-full ${colors.light} flex items-center justify-center`}>
                <div className={`w-16 h-16 rounded-full ${colors.bg} flex items-center justify-center`}>
                  <span className="text-white font-bold">
                    {data.reduce((sum, item) => sum + (item.count || item.value || 0), 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${index % 2 === 0 ? colors.bg : colors.light}`}></div>
                  <span className="text-sm text-gray-600">{item.label || `Category ${index + 1}`}</span>
                </div>
                <span className={`text-sm font-medium ${colors.text}`}>
                  {item.count || item.value || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalyticsChart