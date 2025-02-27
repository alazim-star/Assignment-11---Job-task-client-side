import Navbar from '../Header/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../Footer/Footer';

const MainLayout = () => {
    const location = useLocation();
    
    const noHeaderFooterRoutes = [
        '/dashboard/home',
        '/dashBoard/mytasks2',
        '/Dashboard/MyTasks2',
   
    
        
    ];

    const noHeaderFooter = noHeaderFooterRoutes.includes(location.pathname);

    return (
        <div>
            {!noHeaderFooter && <Navbar />}
            <Outlet />
            {!noHeaderFooter && <Footer />}
        </div>
    );
};

export default MainLayout;
