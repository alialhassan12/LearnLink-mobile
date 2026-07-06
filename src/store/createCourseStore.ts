import {create} from "zustand";
import { MobileFile } from "./chatStore";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { CourseSection } from "../@types/course_sections";

interface CreateCourseStoreState{
    courseData:{
        title:string,
        teacher_id:number,
        category_id:number,
        language:string,
        description:string,
        thumbnail: MobileFile | null,   
        price:number
    },
    setCourseData:(courseData:{
        title:string,
        teacher_id:number,
        category_id:number,
        language:string,
        description:string,
        thumbnail: MobileFile | null,
        price:number
    })=>void,

    // image preview of thumbnail
    imagePreview:string,
    setImagePreview:(imagePreview:string)=>void,

    // set category and language
    selectedCategory:number|null,
    setSelectedCategory:(selectedCategory:number|null)=>void,
    selectedLanguage:string|null,
    setSelectedLanguage:(selectedLanguage:string|null)=>void,

    // progrees states
    stepProgress:number;
    setStepProgress:(stepProgress:number)=>void;

    // course section
    courseSections:CourseSection[],
    setCourseSections:(courseSections:CourseSection[])=>void,
    addCourseSection:(title:string)=>void,
    removeSection:(sectionTitle:string)=>void,
    addFileToSection:(sectionTitle:string,file:MobileFile,fileTitle:string,fileSize:number,fileType:string)=>void,
    removeFileFromSection:(sectionTitle:string,fileTitle:string)=>void,

    // clear state
    clearCourseAndSectionData:()=>void,
}

export const useCreateCourseStore=create<CreateCourseStoreState>((set,get)=>({
    courseData:{
        title:"",
        teacher_id:0,
        category_id:0,
        language:"",
        description:"",
        thumbnail:null,
        price:0
    },
    setCourseData:(courseData)=>set((state)=>({...state,courseData})),
    
    imagePreview:"",
    setImagePreview:(imagePreview)=>set((state)=>({...state,imagePreview})),

    selectedCategory:null,
    setSelectedCategory:(selectedCategory)=>set((state)=>({...state,selectedCategory})),
    selectedLanguage:null,
    setSelectedLanguage:(selectedLanguage)=>set((state)=>({...state,selectedLanguage})),

    stepProgress:10,
    setStepProgress:(stepProgress:number)=>set((state)=>({...state,stepProgress})),

    // course sections
    courseSections:[],
    setCourseSections:(courseSections:CourseSection[])=>set((state)=>({...state,courseSections})),
    addCourseSection:(title:string)=>set((state)=>{
        const {courseSections}=state;
        const newSection:CourseSection={
            title,
            order:courseSections.length+1,
            materials:[]
        };
        return {
            ...state,
            courseSections:[...courseSections,newSection]
        };
    }),

    addFileToSection:(sectionTitle:string,file:MobileFile,fileTitle:string,fileSize:number,fileType:string)=>set((state)=>({
        ...state,
        courseSections: state.courseSections.map(section => 
            section.title === sectionTitle 
                ? { ...section, materials: [...(section.materials || []), {file,title:fileTitle,type:fileType,size:fileSize}]} 
                : section
        )
    })),

    removeFileFromSection:(sectionTitle:string,fileTitle:string)=>set((state)=>({
        ...state,
        courseSections:state.courseSections.map(section=>{
            if(section.title===sectionTitle){
                return {
                    ...section,
                    materials:section.materials?.filter(material=>material.title!==fileTitle)
                };
            };
            return section;
        })
    })),

    removeSection:(sectionTitle:string)=>set((state)=>{
        const {courseSections}=state;
        return {
            ...state,
            courseSections:courseSections.filter(section=>section.title!==sectionTitle)
        };
    }),

    // clear state
    clearCourseAndSectionData:()=>{
        set(()=>({
            courseData:{
                title:"",
                teacher_id:0,
                category_id:0,
                language:"",
                description:"",
                thumbnail:null,
                price:0
            },
            imagePreview:"",
            selectedCategory:null,
            selectedLanguage:null,
            stepProgress:10,
            courseSections:[],
        }));
    }
}));