import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get counts
    const [
      totalUsers,
      totalProjects,
      totalTasks,
      activeProjects,
      completedTasks,
      usersByRole,
      tasksByStatus,
      recentActivities,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.task.count(),
      prisma.project.count({ where: { status: 'ACTIVE' } }),
      prisma.task.count({ where: { status: 'DONE' } }),
      prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),
      prisma.task.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          performedBy: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      summary: {
        totalUsers,
        totalProjects,
        totalTasks,
        activeProjects,
        completedTasks,
      },
      usersByRole,
      tasksByStatus,
      recentActivities,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}