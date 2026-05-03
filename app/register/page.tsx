import { RegisterForm } from "@/components/RegisterForm";
import { Navbar } from "@/components/Navbar";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4 lg:p-12 z-10">
        <div className="w-full max-w-6xl flex flex-row-reverse overflow-hidden glass-panel rounded-[2rem] shadow-2xl border border-white/20">
          
          <div className="hidden lg:flex w-1/2 bg-gradient-to-bl from-primary/20 to-accent-pink/20 p-16 flex-col justify-center relative overflow-hidden border-l border-foreground/5">
            <div className="z-10 relative">
              <h2 className="text-5xl font-extrabold text-foreground mb-6 leading-tight tracking-tight">Elevate Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-pink">Future</span>.</h2>
              <p className="text-lg text-foreground/70 leading-relaxed max-w-md">Join thousands of students and faculty members in creating the ultimate learning environment.</p>
            </div>
            
            <div className="absolute left-[-10%] bottom-[-10%] w-64 h-64 bg-primary/30 rounded-full blur-[80px]" />
            <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-accent-pink/30 rounded-full blur-[80px]" />
          </div>
          
          <div className="w-full lg:w-1/2 p-8 lg:p-16 flex items-center justify-center relative bg-background/50 backdrop-blur-sm">
            <RegisterForm />
          </div>
          
        </div>
      </main>
    </div>
  );
}
