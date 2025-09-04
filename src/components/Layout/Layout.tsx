import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  BarChart3, 
  Lightbulb, 
  Calendar,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: BookOpen },
    { name: 'Journal', href: '/journal', icon: BookOpen },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Insights', href: '/insights', icon: Lightbulb },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-warm-50">

      {/* Desktop Sidebar - hover to reveal */}
      <div className="fixed inset-y-0 left-0 z-50 flex lg:flex-col w-16 lg:w-16 group">
        <div className="absolute inset-y-0 left-0 w-64 -translate-x-[16rem] group-hover:translate-x-0 transition-transform duration-300 ease-in-out bg-white/80 backdrop-blur-sm border-r border-sage-200 overflow-y-auto flex flex-col gap-y-5 px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-sage-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-sage-600 bg-clip-text text-transparent">
                Aline
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={`group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-primary-50 to-sage-50 text-primary-700 border border-primary-200'
                              : 'text-sage-700 hover:text-primary-700 hover:bg-sage-50'
                          }`}
                        >
                          <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-primary-600' : 'text-sage-500 group-hover:text-primary-600'}`} />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 border-b border-sage-200 bg-white/90 backdrop-blur-sm">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-sage-500 rounded-md flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-sage-600 bg-clip-text text-transparent">
               Aline
            </span>
          </Link>
          <button
            type="button"
            className="text-sage-700 hover:text-primary-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-sage-500 rounded-md flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-sage-600 bg-clip-text text-transparent">
                    Mindful Journal
                  </span>
                </Link>
                <button
                  type="button"
                  className="text-sage-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-sage-100">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-medium ${
                            isActive
                              ? 'bg-gradient-to-r from-primary-50 to-sage-50 text-primary-700'
                              : 'text-sage-700 hover:text-primary-700 hover:bg-sage-50'
                          }`}
                        >
                          <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-primary-600' : 'text-sage-500'}`} />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="lg:pl-16">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
