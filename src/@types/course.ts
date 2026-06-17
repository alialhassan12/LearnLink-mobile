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
    language:string,
    price:number,
    status?:string,
    created_at?:string,
    updated_at?:string,

    category?:Category,
    teacher?:Teacher,
    sections?:CourseSection[],
}