export class Grading{
    Comment: string;
    Grade: number;
    ServiceId: number;
    AppUserId: number;

    constructor(comment: string, grade:number, serviceId:number, appUserId: number){
        this.Comment = comment;
        this.Grade = grade;
        this.ServiceId = serviceId;
        this.AppUserId = appUserId;
    }
}