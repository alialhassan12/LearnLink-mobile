import { Booking } from "./booking";
import { SessionMaterial } from "./sessionMaterials";
import { Student } from "./student";
import { Teacher } from "./teahcer";


export interface LiveSession{
    id:number;
    booking_id:number;
    scheduled_date:string;
    scheduled_day:string;
    scheduled_time:string;
    duration:number;
    status:string;
    recording_url:string;
    created_at:string;
    updated_at:string;
    subject?:string;
    student_note?:string;
    session_materials?:SessionMaterial[];

    booking?:Booking;
    teacher?:Teacher;
    student?:Student;
}