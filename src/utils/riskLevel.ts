export const getRiskLevelColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'High':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'Medium':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'Low':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

export const getStatusDotColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'High':
      return 'bg-red-500'
    case 'Medium':
      return 'bg-orange-500'
    case 'Low':
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
}

// High risk script types
const HIGH_RISK_TYPES = ['P2PK', 'P2MS', 'P2PR']

// Medium risk script types (when address is reused)
const MEDIUM_RISK_TYPES = ['P2PKH', 'P2SH', 'P2WPKH', 'P2WSH']

/**
 * Determines the risk level of a UTXO based on its script type and address reuse
 * @param scriptPubType The script pub type (e.g., 'P2PKH', 'P2PK', etc.)
 * @param isAddressReused Whether the address appears multiple times in the UTXO set
 * @returns 'High' | 'Medium' | 'Low'
 */
export const calculateUTXORiskLevel = (
  scriptPubType: string,
  isAddressReused: boolean
): 'High' | 'Medium' | 'Low' => {

  console.log(scriptPubType, isAddressReused)
  
  // High risk script types are always high risk
  if (HIGH_RISK_TYPES.includes(scriptPubType)) {
    return 'High'
  }

  // Medium risk script types are medium risk only if address is reused
  if (MEDIUM_RISK_TYPES.includes(scriptPubType) && isAddressReused) {
    return 'Medium'
  }

  // Default to low risk
  return 'Low'
}

/**
 * Checks if an address is reused in a list of UTXOs
 * @param address The address to check
 * @param utxos List of UTXOs to search in
 * @returns true if the address appears more than once
 */
export const isAddressReused = (address: string, utxos: Array<{ address: string }>): boolean => {
  const count = utxos.filter(utxo => utxo.address === address).length
  return count > 1
}
