export class PaginationModel{
    length : number;
    pageIndex : number;
    pageSize : number;

    constructor(l : number, pi:number, ps:number)
    {
        this.length = l;
        this.pageIndex = pi;
        this.pageSize = ps;
    }
}