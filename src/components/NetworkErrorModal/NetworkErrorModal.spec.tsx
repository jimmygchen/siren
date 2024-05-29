import { render, screen } from '@testing-library/react'
import { mockedRecoilValue } from '../../../test.helpers'
import { UiMode } from '../../constants/enums'
import useUiMode from '../../hooks/useUiMode'
import NetworkErrorModal from './NetworkErrorModal'
import clearAllMocks = jest.clearAllMocks

jest.mock('../../hooks/useMediaQuery', () => jest.fn(() => false))
jest.mock('../../hooks/useUiMode', () => jest.fn())

const mockedUseUiMode = useUiMode as jest.MockedFn<typeof useUiMode>

describe('NetworkErrorModal component', () => {
  beforeEach(() => {
    clearAllMocks()
  })
  it('should render validator and beacon error text', () => {
    mockedUseUiMode.mockReturnValue({ mode: UiMode.DARK, toggleUiMode: jest.fn })
    mockedRecoilValue.mockReturnValue(true)
    render(<NetworkErrorModal isValidatorNetworkError isBeaconNetworkError />)

    expect(screen.getByTestId('networkText')).toHaveTextContent(
      'networkErrorModal.affectedNetworksnetworkErrorModal.beaconAndValidator networkErrorModal.reconfigureOrContactdiscord.',
    )
  })
  it('should render Beacon error', () => {
    mockedUseUiMode.mockReturnValue({ mode: UiMode.DARK, toggleUiMode: jest.fn })
    mockedRecoilValue.mockReturnValueOnce(true)
    mockedRecoilValue.mockReturnValueOnce(false)
    render(<NetworkErrorModal isBeaconNetworkError isValidatorNetworkError={false} />)

    expect(screen.getByTestId('networkText')).toHaveTextContent(
      'networkErrorModal.affectedNetworksnetworkErrorModal.beaconNode networkErrorModal.reconfigureOrContactdiscord.',
    )
  })
  it('should render Validator error', () => {
    mockedUseUiMode.mockReturnValue({ mode: UiMode.DARK, toggleUiMode: jest.fn })
    mockedRecoilValue.mockReturnValueOnce(false)
    mockedRecoilValue.mockReturnValueOnce(true)
    render(<NetworkErrorModal isValidatorNetworkError isBeaconNetworkError={false} />)

    expect(screen.getByTestId('networkText')).toHaveTextContent(
      'networkErrorModal.affectedNetworksnetworkErrorModal.validatorClient networkErrorModal.reconfigureOrContactdiscord.',
    )
  })
})
