import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const projects = await prisma.project.findMany({
            include: {
                tasks: true,
                createdBy: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })

        return NextResponse.json(projects)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'MANAGER' && session.user.role !== 'ADMIN') {
        return new NextResponse("Forbidden", { status: 403 })
    }

    try {
        const body = await req.json()
        const { name, description, status, priority, startDate, endDate } = body

        const project = await prisma.project.create({
            data: {
                name,
                description,
                status,
                priority,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                createdById: session.user.id
            }
        })

        return NextResponse.json(project)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
