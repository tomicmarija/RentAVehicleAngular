export class Reservation{

    StartDate: DateTimeFormat;
    EndDate: DateTimeFormat;
    VehicleId: number;
    StartBranchId: number;
    EndBranchId: number;

    constructor(startDate: DateTimeFormat, endDate: DateTimeFormat, vehicleId: number, startBranchId: number, endBranchId: number){
        this.StartDate = startDate;
        this.EndDate = endDate;
        this.VehicleId = vehicleId;
        this.StartBranchId = startBranchId; 
        this.EndBranchId = endBranchId;
    }
}