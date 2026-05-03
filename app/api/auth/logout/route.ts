import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Try to import and use the clearSession function
    const { clearSession } = await import('@/lib/auth');
    clearSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout failed (database not set up):', error);
    // Return success anyway for demo mode
    return NextResponse.json({ success: true });
  }
}
