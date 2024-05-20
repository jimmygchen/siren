import { UiMode } from '../constants/enums'
import { DeviceList, OptionalString } from './index'

export type UiThemeStorage = UiMode | undefined
export type UsernameStorage = OptionalString
export type ActiveCurrencyStorage = string
export type ValidatorIndicesStorage = OptionalString
export type DeviceListStorage = DeviceList | undefined
