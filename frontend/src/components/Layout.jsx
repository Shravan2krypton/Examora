import { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

export default function Layout() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
   const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const linkBase =
    'text-sm font-medium px-2 py-1 rounded-md transition-colors duration-150';
  const linkInactive =
    'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400';
  const linkActive =
    'text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <nav className="glass-effect border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3 sm:gap-6">
              <Link
                to="/"
                className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-primary-600 dark:text-primary-400"
                onClick={closeMobile}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-lg">
                  📝
                </span>
                <span className="hidden xs:inline">Online Exam System</span>
                <span className="xs:hidden">OES</span>
              </Link>
              <div className="hidden md:flex items-center gap-3">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                >
                  Home
                </NavLink>
                {user?.role === 'student' && (
                  <>
                    <NavLink
                      to="/student"
                      end
                      className={({ isActive }) =>
                        `${linkBase} ${isActive ? linkActive : linkInactive}`
                      }
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/student/exams"
                      className={({ isActive }) =>
                        `${linkBase} ${isActive ? linkActive : linkInactive}`
                      }
                    >
                      Exams
                    </NavLink>
                    <NavLink
                      to="/student/results"
                      className={({ isActive }) =>
                        `${linkBase} ${isActive ? linkActive : linkInactive}`
                      }
                    >
                      Results
                    </NavLink>
                    <NavLink
                      to="/student/question-banks"
                      className={({ isActive }) =>
                        `${linkBase} ${isActive ? linkActive : linkInactive}`
                      }
                    >
                      Question Banks
                    </NavLink>
                  </>
                )}
                {user?.role === 'faculty' && (
                  <>
                    <NavLink
                      to="/faculty"
                      end
                      className={({ isActive }) =>
                        `${linkBase} ${isActive ? linkActive : linkInactive}`
                      }
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/faculty/create-exam"
                      className={({ isActive }) =>
                        `${linkBase} ${isActive ? linkActive : linkInactive}`
                      }
                    >
                      Create Exam
                    </NavLink>
                    <NavLink
                      to="/faculty/upload-questionbank"
                      className={({ isActive }) =>
                        `${linkBase} ${isActive ? linkActive : linkInactive}`
                      }
                    >
                      Upload PDF
                    </NavLink>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-xl hover-lift transition-all duration-200"
                aria-label="Toggle dark mode"
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  {darkMode ? '☀️' : '🌙'}
                </motion.div>
              </button>
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
              >
                <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 mb-1 rounded-full" />
                <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 mb-1 rounded-full" />
                <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full" />
              </button>
              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {user.name} ({user.role})
                  </span>
                  <button onClick={logout} className="btn-secondary text-xs sm:text-sm">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex gap-2">
                  <Link to="/login" className="btn-secondary text-xs sm:text-sm">Login</Link>
                  <Link to="/register" className="btn-primary text-xs sm:text-sm">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-2">
              <NavLink
                to="/"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Home
              </NavLink>
              {user?.role === 'student' && (
                <>
                  <NavLink
                    to="/student"
                    end
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? linkActive : linkInactive}`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/student/exams"
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? linkActive : linkInactive}`
                    }
                  >
                    Exams
                  </NavLink>
                  <NavLink
                    to="/student/results"
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? linkActive : linkInactive}`
                    }
                  >
                    Results
                  </NavLink>
                  <NavLink
                    to="/student/question-banks"
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? linkActive : linkInactive}`
                    }
                  >
                    Question Banks
                  </NavLink>
                </>
              )}
              {user?.role === 'faculty' && (
                <>
                  <NavLink
                    to="/faculty"
                    end
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? linkActive : linkInactive}`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/faculty/create-exam"
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? linkActive : linkInactive}`
                    }
                  >
                    Create Exam
                  </NavLink>
                  <NavLink
                    to="/faculty/upload-questionbank"
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? linkActive : linkInactive}`
                    }
                  >
                    Upload PDF
                  </NavLink>
                </>
              )}
              {!user && (
                <div className="flex gap-2 mt-2">
                  <Link
                    to="/login"
                    onClick={closeMobile}
                    className="btn-secondary flex-1 text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobile}
                    className="btn-primary flex-1 text-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
              {user && (
                <button
                  onClick={() => {
                    closeMobile();
                    logout();
                  }}
                  className="btn-secondary mt-2 text-sm"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="glass-effect border-t border-gray-200 dark:border-gray-700 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Examora - Online Examination System
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                &copy; {new Date().getFullYear()} All rights reserved
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer">
                About
              </span>
              <span className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer">
                Privacy
              </span>
              <span className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer">
                Terms
              </span>
              <span className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer">
                Contact
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
