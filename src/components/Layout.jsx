import { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

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
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
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
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-xl"
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
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

      <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Online Examination System &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
