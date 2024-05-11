import axios from 'axios';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next'
import displayToast from '../../utilities/displayToast'
import { ToastType } from '../types'
import { SignedExitData } from '../types/validator'

const useExitValidator = (pubKey: string) => {
  const { t } = useTranslation()
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('session-token')}`
    }
  }

  const getSignedExit = async (password: string): Promise<SignedExitData | undefined> => {
    try {
      const { data } = await axios.post('/api/sign-validator-exit', {pubKey, password}, config)

      return data
    } catch (e) {
      displayToast(t('error.unableToSignExit'), ToastType.ERROR)
    }
  }
  const submitSignedMessage = async (data: {data: SignedExitData, password: string}) => {
    try {
      const { status } = await axios.post('/api/execute-validator-exit', data, config)

      if (status === 200) {
        displayToast(t('success.validatorExit'), ToastType.SUCCESS)
      }
    } catch (e) {
      displayToast(t('error.invalidExit'), ToastType.ERROR)
    }
  }

  return {
    getSignedExit,
    submitSignedMessage,
  }
}

export default useExitValidator
