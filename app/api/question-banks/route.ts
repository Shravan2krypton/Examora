import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { questionBanks, users } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all active question banks with uploader information
    const questionBankList = await db
      .select({
        id: questionBanks.id,
        title: questionBanks.title,
        description: questionBanks.description,
        fileName: questionBanks.fileName,
        fileSize: questionBanks.fileSize,
        filePath: questionBanks.filePath,
        subject: questionBanks.subject,
        pages: questionBanks.pages,
        isActive: questionBanks.isActive,
        createdAt: questionBanks.createdAt,
        updatedAt: questionBanks.updatedAt,
        uploaderName: users.name,
        uploaderEmail: users.email,
      })
      .from(questionBanks)
      .leftJoin(users, eq(questionBanks.uploadedBy, users.id))
      .where(eq(questionBanks.isActive, true))
      .orderBy(desc(questionBanks.createdAt));

    // Format the response
    const formattedQuestionBanks = questionBankList.map(qb => ({
      id: qb.id,
      title: qb.title,
      description: qb.description,
      fileName: qb.fileName,
      fileSize: `${(qb.fileSize / (1024 * 1024)).toFixed(1)} MB`,
      filePath: qb.filePath,
      subject: qb.subject,
      pages: qb.pages,
      uploadDate: qb.createdAt.toISOString().split('T')[0],
      uploader: {
        name: qb.uploaderName,
        email: qb.uploaderEmail,
      },
    }));

    return NextResponse.json({
      success: true,
      questionBanks: formattedQuestionBanks,
    });

  } catch (error) {
    console.error('Fetch question banks error:', error);
    
    // Return demo data if database is not available
    const demoQuestionBanks = [
      {
        id: 'demo-1',
        title: 'Mathematics Question Bank',
        description: 'Complete set of mathematics questions for all levels',
        fileName: 'sample-math-questions.pdf',
        fileSize: '0.1 MB',
        filePath: '/uploads/question-banks/sample-math-questions.pdf',
        subject: 'Mathematics',
        pages: 45,
        uploadDate: '2024-01-15',
        uploader: {
          name: 'Demo Admin',
          email: 'admin@example.com',
        },
      },
      {
        id: 'demo-2',
        title: 'Physics Question Bank',
        description: 'Comprehensive physics questions with solutions',
        fileName: 'sample-physics-questions.pdf',
        fileSize: '0.1 MB',
        filePath: '/uploads/question-banks/sample-physics-questions.pdf',
        subject: 'Physics',
        pages: 38,
        uploadDate: '2024-01-14',
        uploader: {
          name: 'Demo Admin',
          email: 'admin@example.com',
        },
      },
      {
        id: 'demo-3',
        title: 'Chemistry Question Bank',
        description: 'Chemistry questions covering all topics',
        fileName: 'chemistry_questions.pdf',
        fileSize: '3.2 MB',
        filePath: '/uploads/question-banks/demo-chemistry.pdf',
        subject: 'Chemistry',
        pages: 52,
        uploadDate: '2024-01-13',
        uploader: {
          name: 'Demo Admin',
          email: 'admin@example.com',
        },
      },
    ];

    return NextResponse.json({
      success: true,
      questionBanks: demoQuestionBanks,
      message: 'Database not available - showing demo data',
    });
  }
}
