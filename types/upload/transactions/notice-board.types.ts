import { z } from 'zod';
import { noticeBoardSchema } from '@/schemas/upload/transactions/notice-board.schema';

export type INoticeBoard = z.infer<typeof noticeBoardSchema>;

export interface INoticeBoardSearch {
    from_date: Date;
    to_date: Date;
}
