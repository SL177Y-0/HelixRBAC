import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        return new NextResponse("Forbidden", { status: 403 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        const logs = await prisma.auditLog.findMany({
            take: limit,
            skip: offset,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                performedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        })

        const total = await prisma.auditLog.count()

        return NextResponse.json({
            logs,
            pagination: {
                total,
                limit,
                offset,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}