import { useMemo } from 'react'
import { ValidatorCache } from '../types/validator'

const useFilteredValidatorCacheData = (
  validatorCacheData: ValidatorCache,
  indices?: string[],
): ValidatorCache => {
  return useMemo(() => {
    if (!indices) return validatorCacheData

    return Object.keys(validatorCacheData)
      .filter((key) => indices.includes(key))
      .reduce((obj, key: string) => {
        return Object.assign(obj, {
          [key]: validatorCacheData[Number(key)],
        })
      }, {}) as ValidatorCache
  }, [validatorCacheData, indices])
}

export default useFilteredValidatorCacheData
