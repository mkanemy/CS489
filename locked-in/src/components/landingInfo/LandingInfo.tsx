import { Stack, Typography } from '@mui/material'
import './LandingInfo.css'
import { SecurityOutlined, BuildOutlined, SpeedOutlined } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const infoItems = [
    {
        icon: <SecurityOutlined sx={{ color: 'text.secondary' }} />,
        title: 'Fortified Security',
        description: 'Protect your sensitive files with end-to-end encryption and multi-factor authentication.',
    }, 
    {
        icon: <SpeedOutlined sx={{ color: 'text.secondary' }} />,
        title: 'Instant & Seamless Access',
        description: 'Retrieve your stored text and files from any device, anytime.',
    }, 
    {
        icon: <BuildOutlined sx={{ color: 'text.secondary' }} />,
        title: 'Built for Flexibility',
        description: 'Store anything—notes, passwords, documents—securely and effortlessly.',
    }, 
]

function LandingInfo() {
    return (
        <Stack sx={{ flexDirection: 'column', alignSelf: 'center', gap: 3, maxWidth: 450 }}>
            <Stack sx={{ flexDirection: 'row', gap: 1 }}>
                <LockOutlinedIcon sx={{ color: 'text.secondary', alignSelf: 'center', fontSize: '2rem' }} />
                <Typography sx={{ fontSize: '2rem', fontWeight: 600 }}>
                    LockedIn
                </Typography>
            </Stack>

            {infoItems.map((item) => (
                <Stack direction="row" sx={{ gap: 2 }}>
                    {item.icon}
                    <div>
                        <Typography sx={{ fontWeight: 'medium', marginBottom: '5px' }}>
                            {item.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {item.description}
                        </Typography>
                    </div>
                </Stack>
            ))}
        </Stack>
    )
}

export default LandingInfo
