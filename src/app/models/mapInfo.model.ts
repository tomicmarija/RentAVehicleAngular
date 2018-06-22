export class MapInfo {
    label: string;
    centerLat: number;
    centerLong: number;

    constructor(lat: number, long: number, label:string){
        this.label = label;
        this.centerLat = lat;
        this.centerLong = long;
    }
} 