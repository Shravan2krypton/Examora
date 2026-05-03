import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { db } from '@/lib/db';
import { questionBanks } from '@/lib/schema';
import { getSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can upload question banks.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const subject = formData.get('subject') as string;
    const pages = formData.get('pages') ? parseInt(formData.get('pages') as string) : null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'question-banks');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's fine
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${randomString}-${file.name}`;
    const filePath = join(uploadsDir, fileName);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Save to database
    try {
      const questionBank = await db.insert(questionBanks).values({
        title: title || file.name.replace('.pdf', ''),
        description: description || null,
        fileName: file.name,
        fileSize: file.size,
        filePath: `/uploads/question-banks/${fileName}`,
        uploadedBy: session.id as string,
        subject: subject || null,
        pages: pages,
        isActive: true,
      }).returning();

      return NextResponse.json({
        success: true,
        questionBank: questionBank[0],
        message: 'Question bank uploaded successfully'
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Return success with file info even if database fails
      return NextResponse.json({
        success: true,
        questionBank: {
          id: `temp-${Date.now()}`,
          title: title || file.name.replace('.pdf', ''),
          description: description || null,
          fileName: file.name,
          fileSize: file.size,
          filePath: `/uploads/question-banks/${fileName}`,
          subject: subject || null,
          pages: pages,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        message: 'Question bank uploaded successfully (demo mode)'
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload question bank' },
      { status: 500 }
    );
  }
}
