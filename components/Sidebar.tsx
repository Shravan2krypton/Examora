import Link from "next/link";
import { LayoutDashboard, CheckSquare, FileText, BarChart, Settings } from "lucide-react";

export function Sidebar({ role }: { role: "admin" | "student" }) {
  const adminLinks = [
    { href: "/dashboard/admin", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: "/admin/questions", label: "Question Bank", icon: <CheckSquare className="w-5 h-5" /> },
    { href: "/admin/exams", label: "Manage Exams", icon: <FileText className="w-5 h-5" /> },
    { href: "/admin/results", label: "Student Results", icon: <BarChart className="w-5 h-5" /> },
  ];

  const studentLinks = [
    { href: "/dashboard/student", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: "/student/exams", label: "Available Exams", icon: <FileText className="w-5 h-5" /> },
    { href: "/student/results", label: "My Results", icon: <BarChart className="w-5 h-5" /> },
  ];

  const links = role === "admin" ? adminLinks : studentLinks;

  return (
    <aside className="w-72 glass-panel border-r border-t-0 border-b-0 border-l-0 border-foreground/5 hidden md:flex flex-col min-h-[calc(100vh-80px)] p-6">
      <div className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-6 ml-2">Navigation</div>
      <nav className="flex-grow space-y-2">
        {links.map((link) => (
          <Link 
            key={link.href} 
            href={link.href} 
            className="flex items-center px-4 py-3 text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all font-medium group"
          >
            <div className="mr-3 group-hover:scale-110 transition-transform">
              {link.icon}
            </div>
            {link.label}
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-foreground/10">
        <div className="flex items-center px-4 py-3 text-foreground/70 rounded-xl font-medium">
           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-purple text-white flex items-center justify-center font-bold mr-3 shadow-md">
             {role === "admin" ? "A" : "S"}
           </div>
           <div className="flex flex-col">
             <span className="text-sm font-bold text-foreground capitalize">{role}</span>
             <span className="text-xs text-foreground/50">Online</span>
           </div>
        </div>
      </div>
    </aside>
  );
}
