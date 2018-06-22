export class Vehicle
{
    Id : number;
    Model : string;
    Manufacturer : string;
    YearOfMaking : number;
    Foto : string;
    Descritpion : string;
    ServiceId : number;
    TypeId : number;
    Price : number;
    Enable : Boolean;

    constructor(id : number, model : string, manufacturer : string, yearofmaking : number, foto : string, description : string, serviceId : number, typeId : number, price: number, enable : Boolean)
    {
        this.Id = id;
        this.Model = model;
        this.Manufacturer = manufacturer;
        this.YearOfMaking = yearofmaking;
        this.Foto = foto;
        this.Descritpion = description;
        this.ServiceId = serviceId;
        this.TypeId = typeId;
        this.Price = price;
        this.Enable = enable;
    }
}