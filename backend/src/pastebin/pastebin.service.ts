import { Injectable } from '@nestjs/common';
import cuid = require('cuid');
import { Paste, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreatePasteDto } from './DTOs/create-paste.dto';

@Injectable()
export class PastebinService {
    constructor(private readonly prisma: PrismaService) {}

    async createPaste(paste: CreatePasteDto, userId: number): Promise<Paste> {
        return this.prisma.paste.create({
            data: {
                content: paste.content,
                syntax: paste.syntax,
                slug: cuid(),
                userId: userId,
            },
        });
    }

    async findPaste(slug: string): Promise<Paste> {
        return this.prisma.paste.findUnique({
            where: {
                slug: slug,
            },
        });
    }

    async findPastesByUserId(
        id: number,
        page: number,
        take: number,
        search: string
    ): Promise<Paste[]> {
        const query: Prisma.PasteWhereInput = {
            userId: id,
        };

        if (search) {
            query.content = {
                search,
            };
        }

        return this.prisma.paste.findMany({
            where: query,
            take,
            skip: (page - 1) * take,
        });
    }

    async deletePaste(id: number): Promise<boolean> {
        try {
            await this.prisma.paste.delete({ where: { id: id } });
            return true;
        } catch (e) {
            return false;
        }
    }
}
