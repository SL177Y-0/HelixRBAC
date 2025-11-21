import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET single task
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const task = await prisma.task.findUnique({
      where: { id: params.id },
      include: {
        project: true,
        assignee: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Users can only see their own tasks
    if (session.user.role === 'USER' && task.assigneeId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

// PATCH update task
export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Get existing task
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Users can only update status of their own tasks
    if (session.user.role === 'USER') {
      if (existingTask.assigneeId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      // Only allow status updates for regular users
      // We need to be careful here to only update status if it's present in body
      // But for simplicity based on guide, we'll just extract status if user is USER
      // However, the guide says "body = { status: body.status }" which implies filtering
      if (body.status) {
          // Re-assign body to only contain status to prevent other updates
          // But we need to be careful about type safety if we were using TS strictly
          // Here we just use the new object
          const newBody = { status: body.status };
          // We'll use this newBody for the update
           const task = await prisma.task.update({
              where: { id: params.id },
              data: newBody,
            });
            return NextResponse.json(task);
      } else {
           // If user tries to update something else or nothing, we might want to error or just do nothing
           // For now, let's assume if they are USER they can ONLY update status.
           // If they didn't send status, it's a bad request or forbidden to update other fields
           return NextResponse.json({ error: 'Forbidden: Users can only update status' }, { status: 403 });
      }
    }

    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        ...body,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE task
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.task.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}