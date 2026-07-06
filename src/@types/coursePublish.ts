import { MobileFile } from "../store/chatStore";
import { CourseSection } from "./course_sections";

export interface CoursePublish{
    category_id:number,
    title:string,
    description:string,
    thumbnail:MobileFile,
    language:string,
    price:number,
    sections:CourseSection[]
}