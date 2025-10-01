import { Outlet } from 'react-router-dom';
import PersistentNavBar from './UI components/navbar/PersistentNavBar';

/** Keeps navbar and only content below the navbar changes when moving through pages */
const Layout: React.FC = () => {
    return (
        <div>
            <PersistentNavBar />
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;