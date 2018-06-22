export class Service
{
    Id : number;
    Name : string;
    Logo : string;
    Email : string;
    Descritpion : string;
    Approved : Boolean;

    constructor(id : number, name : string, logo :string, email :string, description:string, approved : Boolean)
    {
        this.Id = id;
        this.Name = name;
        this.Logo = logo;
        this.Email = email;
        this.Descritpion = description;
        this.Approved = approved;
    }
}