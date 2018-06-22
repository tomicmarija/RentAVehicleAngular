export class PriceList
{
    Id : number;
    StartDate : Date;
    EndDate : Date;
    ServiceId : number;

    constructor(id : number, startDate : Date, endDate : Date, serviceId : number)
    {
        this.Id = id;
        this.StartDate = startDate;
        this.EndDate = endDate;
        this.ServiceId = serviceId;
    }
}