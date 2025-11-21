import { PrismaClient, Role, TaskStatus } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('password123', 12)

    // Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@helix.com' },
        update: {},
        create: {
            email: 'admin@helix.com',
            name: 'Admin User',
            password,
            role: 'ADMIN',
            bio: 'System Administrator',
            department: 'IT',
        },
    })

    // Create Manager
    const manager = await prisma.user.upsert({
        where: { email: 'manager@helix.com' },
        update: {},
        create: {
            email: 'manager@helix.com',
            name: 'Manager User',
            password,
            role: 'MANAGER',
            bio: 'Project Manager',
            department: 'Product',
        },
    })

    // Create User
    const user = await prisma.user.upsert({
        where: { email: 'user1@helix.com' },
        update: {},
        create: {
            email: 'user1@helix.com',
            name: 'John Doe',
            password,
            role: 'USER',
            bio: 'Frontend Developer',
            department: 'Engineering',
        },
    })

    // Create Project
    const project = await prisma.project.create({
        data: {
            name: 'Helix Dashboard Redesign',
            description: 'Complete overhaul of the admin dashboard UI.',
            status: 'ACTIVE',
            priority: 'HIGH',
            startDate: new Date(),
            createdById: manager.id,
            tasks: {
                create: [
                    {
                        title: 'Design System',
                        description: 'Create new color palette and typography.',
                        status: 'DONE',
                        priority: 'HIGH',
                        assigneeId: user.id,
                    },
                    {
                        title: 'Implement Sidebar',
                        description: 'Build responsive sidebar navigation.',
                        status: 'IN_PROGRESS',
                        priority: 'MEDIUM',
                        assigneeId: user.id,
                    },
                ],
            },
        },
    })

    console.log({ admin, manager, user, project })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
