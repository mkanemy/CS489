import { CssBaseline, Stack } from '@mui/material'
import LandingInfo from '../../components/landingInfo/LandingInfo'
import SignInCard from '../../components/signInCard/SignInCard'
import './LandingView.css'

function LandingView() {
    return (
        <div className="LandingViewWrapper">
            <Stack className="LandingView" sx={{ flexDirection: 'row', alignSelf: 'center' }}>
                <CssBaseline enableColorScheme />
                <LandingInfo />
                <SignInCard />
            </Stack>
        </div>
    )
}

export default LandingView
