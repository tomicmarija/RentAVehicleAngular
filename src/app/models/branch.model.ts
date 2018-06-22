export class Branch
{
    Picture : string;
    Address : string;
    Latitude : number;
    Longitute : number;
    ServiceId : number;

    constructor(picture : string, address: string, latitude : number, longitude : number, servieId : number)
    {
        this.Picture = picture;
        this.Address = address;
        this.Latitude = latitude;
        this.Longitute = longitude;
        this.ServiceId = servieId;
    }

}