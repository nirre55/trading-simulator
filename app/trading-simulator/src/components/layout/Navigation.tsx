import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

// Interface pour les liens de navigation
export interface NavItem {
  path: string;
  label: string;
  icon?: React.ReactNode;
}

// Liste par défaut des éléments de navigation
const defaultNavItems: NavItem[] = [
  { 
    path: '/', 
    label: 'navigation.home',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-4a1 1 0 00-1-1h-2a1 1 0 00-1 1v4a1 1 0 01-1 1H7a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
  },
  { 
    path: '/manual', 
    label: 'navigation.manual',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
  },
  { 
    path: '/calculated', 
    label: 'navigation.calculated',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
  },
];

interface NavigationProps {
  items?: NavItem[];
}

const Navigation: React.FC<NavigationProps> = ({ items = defaultNavItems }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Gestion de l'état responsive
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Vérifier initialement
    checkIfMobile();

    // Écouter les changements de taille d'écran
    window.addEventListener('resize', checkIfMobile);

    // Nettoyer l'écouteur d'événement
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Fermer le menu quand on change de page sur mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <>
      {/* Bouton hamburger pour les mobiles */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden fixed top-4 left-4 z-30 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white ${
          isOpen ? 'bg-slate-600' : 'bg-slate-800'
        }`}
        aria-label="Menu"
      >
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay pour fermer le menu lorsqu'on clique à l'extérieur sur mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav 
        className={`fixed inset-y-0 left-0 w-64 bg-slate-100 dark:bg-slate-800 text-gray-800 dark:text-white shadow-lg overflow-y-auto z-20 transform transition-transform duration-300 ease-in-out ${
          (isMobile && !isOpen) ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-8 text-center">{t('app.title')}</h2>
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  {item.icon && <span className="mr-3">{item.icon}</span>}
                  <span className="text-lg">{t(item.label)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navigation; 