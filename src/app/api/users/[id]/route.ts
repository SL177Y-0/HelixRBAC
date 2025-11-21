import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { hash } from "bcryptjs"

export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const session = await getServerSession(authOptions)

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    // Only Admin or the user themselves can view details
    if (session.user.role !== 'ADMIN' && session.user.id !== params.id) {
        return new NextResponse("Forbidden", { status: 403 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: params.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                bio: true,
                phone: true,
                isActive: true,
                createdAt: true,
                image: true,
            }
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const session = await getServerSession(authOptions)

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    // Only Admin or the user themselves can update details
    if (session.user.role !== 'ADMIN' && session.user.id !== params.id) {
        return new NextResponse("Forbidden", { status: 403 })
    }

    try {
        const body = await req.json()
        const { name, email, password, role, department, bio, phone, isActive } = body

        // Only Admin can change role or active status
        if ((role || isActive !== undefined) && session.user.role !== 'ADMIN') {
            return new NextResponse("Forbidden: Only Admins can change roles or status", { status: 403 })
        }

        const updateData: any = {
            name,
            email,
            department,
            bio,
            phone,
        }

        if (role) updateData.role = role
        if (isActive !== undefined) updateData.isActive = isActive
        if (password) {
            updateData.password = await hash(password, 12)
        }

        const user = await prisma.user.update({
            where: { id: params.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
            }
        })

        // Create Audit Log
        await prisma.auditLog.create({
            data: {
                action: 'USER_UPDATED',
                entityType: 'USER',
                entityId: user.id,
                performedById: session.user.id,
                details: { updatedFields: Object.keys(updateData) }
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        return new NextResponse("Forbidden", { status: 403 })
    }

    try {
        // Prevent deleting yourself
        if (session.user.id === params.id) {
            return new NextResponse("Cannot delete your own account", { status: 400 })
        }

        const user = await prisma.user.delete({
            where: { id: params.id }
        })

        // Create Audit Log
        await prisma.auditLog.create({
            data: {
                action: 'USER_DELETED',
                entityType: 'USER',
                entityId: params.id,
                performedById: session.user.id,
                details: { deletedUserEmail: user.email }
            }
        })

        return NextResponse.json({ message: "User deleted successfully" })
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}