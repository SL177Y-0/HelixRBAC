import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { hash } from "bcryptjs"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
        return new NextResponse("Forbidden", { status: 403 })
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                isActive: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(users)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
        return new NextResponse("Forbidden", { status: 403 })
    }

    try {
        const body = await req.json()
        const { name, email, password, role, department } = body

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return new NextResponse("User already exists", { status: 400 })
        }

        const hashedPassword = await hash(password, 12)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                department,
            }
        })

        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        })
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
