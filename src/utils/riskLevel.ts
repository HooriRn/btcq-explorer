export const getRiskLevelColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'High':
      return 'bg-red-100 text-red-800'
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'Low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const getStatusDotColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'High':
      return 'bg-red-500'
    case 'Medium':
      return 'bg-yellow-500'
    case 'Low':
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
}
