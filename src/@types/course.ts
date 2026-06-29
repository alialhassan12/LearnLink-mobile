import { Category } from "./category";
import { CourseSection } from "./course_sections";
import { Teacher } from "./teahcer";

export interface Course{
    id?:number;
    course_id?:number;
    title:string,
    teacher_id?:number,
    category_id:number,
    description:string,
    thumbnail:string | File,
    thumbnail_url?:string,
    language:string,
    price:number,
    status?:string,
    created_at?:string,
    updated_at?:string,

    category?:Category,
    teacher?:Teacher,
    sections?:CourseSection[],
    
    course_reviews_avg_rating?:number;
    course_reviews_count?:number;
    enrollments_count?:number;
}