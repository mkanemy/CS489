import AuthGuard from '../../components/authGuard/AuthGuard'
import HomeView from '../homeView/HomeView'

const ProtectedHome = () => (
  <AuthGuard>
    <HomeView />
  </AuthGuard>
)

export default ProtectedHome
