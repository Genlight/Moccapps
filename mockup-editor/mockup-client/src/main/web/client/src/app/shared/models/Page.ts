import { Comment } from './comments';

export class Page {
    id?: number;
    page_name?: string;
    height: number;
    width: number;
    page_data?: string;
    project_id?: number;
    page_order?: number;
    comments?: Comment[];
}
