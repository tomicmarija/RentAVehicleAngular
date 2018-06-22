export class PriceItem
{
    Price : number;
    VehicleId : number;
    PriceListId : number;

    constructor(price : number, vehicleId : number, priceLid : number)
    {
        this.Price = price;
        this.VehicleId = vehicleId;
        this.PriceListId = priceLid;
    }
}