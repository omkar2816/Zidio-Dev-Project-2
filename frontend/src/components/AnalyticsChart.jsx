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
    primary: {
      bg: 'bg-primary-500',
      light: 'bg-primary-100 dark:bg-primary-900/20',
      text: 'text-primary-600 dark:text-primary-400',
      gradient: 'from-primary-500 to-primary-600'
    },
    secondary: {
      bg: 'bg-secondary-500', 
      light: 'bg-secondary-100 dark:bg-secondary-900/20',
      text: 'text-secondary-600 dark:text-secondary-400',
      gradient: 'from-secondary-500 to-secondary-600'
    },
    green: {
      bg: 'bg-green-500',
      light: 'bg-green-100 dark:bg-green-900/20', 
      text: 'text-green-600 dark:text-green-400',
      gradient: 'from-green-500 to-green-600'
    },
    blue: {
      bg: 'bg-blue-500',
      light: 'bg-blue-100 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      gradient: 'from-blue-500 to-blue-600'
    }
  }

  const colors = colorClasses[color] || colorClasses.primary

  if (!data || data.length === 0) {
    return (
      <div className="card-modern p-6">
        <h3 className="text-lg font-semibold text-theme-text mb-4">{title}</h3>
        <div className="text-center text-theme-text-secondary py-8">
          No data available
        </div>
      </div>
    )
  }

  return (
    <div className="card-modern p-6">
      <h3 className={`text-lg font-semibold text-theme-text mb-4`}>
        {title}
      </h3>
      
      {type === 'bar' && (
        <div className="space-y-3">
          {data.slice(-10).map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-theme-text-secondary min-w-0 flex-1 truncate">
                {item.label || item._id || `Item ${index + 1}`}
              </span>
              <div className="flex items-center space-x-2 flex-1 max-w-xs">
                <div className="flex-1 bg-theme-bg-tertiary rounded-full h-2 ml-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${colors.gradient}`}
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
                <div className="relative bg-theme-bg-tertiary rounded-t w-full flex items-end justify-center min-h-0" style={{ height: '120px' }}>
                  <div
                    className={`bg-gradient-to-t ${colors.gradient} rounded-t w-full transition-all duration-500 flex items-end justify-center`}
                    style={{ height: `${getBarHeight(item.count || item.value)}%` }}
                  >
                    <span className="text-xs text-white font-medium mb-1">
                      {item.count || item.value || 0}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-theme-text-secondary mt-1 text-center">
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
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${colors.gradient} flex items-center justify-center`}>
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
                  <div className={`w-3 h-3 rounded-full ${index % 2 === 0 ? `bg-gradient-to-r ${colors.gradient}` : colors.light}`}></div>
                  <span className="text-sm text-theme-text-secondary">{item.label || `Category ${index + 1}`}</span>
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