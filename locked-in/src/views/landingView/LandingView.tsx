import { CssBaseline, Stack } from '@mui/material'
import LandingInfo from '../../components/landingInfo/LandingInfo'
import SignInCard from '../../components/signInCard/SignInCard'
import './LandingView.css'

function LandingView() {
    return (
        <Stack className="LandingView" sx={{ flexDirection: 'row', alignSelf: 'center' }}>
            <CssBaseline enableColorScheme />
            <LandingInfo />
            <SignInCard />
        </Stack>
    )
}

export default LandingView
