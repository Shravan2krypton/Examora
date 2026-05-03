import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Try to import and use the session function
    const { getSession } = await import('@/lib/auth');
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user: session });
  } catch (error) {
    console.error('Session check failed (database not set up):', error);
    
    // Return demo user for UI testing when database isn't set up
    const demoUser = {
      id: 'demo-user',
      email: 'demo@example.com',
      role: 'admin',
      name: 'Demo User'
    };
    
    return NextResponse.json({ user: demoUser });
  }
}
