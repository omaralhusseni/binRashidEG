import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
    const location = useLocation();

    const navItems = [
        { path: '/business-setup', label: 'Business Setup' },
        { path: '/business-solutions', label: 'Business Solutions' },
        { path: '/marketing', label: 'Marketing' },
    ];

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center justify-between w-screen space-x-2">
                        <Link to="/" className="flex items-center">
                            <img
                                src="/logo.png"
                                alt="BinRashid Group Logo"
                                className="h-8 w-auto"
                            />
                        </Link>

                        <div className="items flex px-3 justify-between gap-2">
                            {/* Navigation Items */}
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${location.pathname === item.path
                                        ? 'border-blue-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
