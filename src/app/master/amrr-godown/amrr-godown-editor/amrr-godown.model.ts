import { IAmrrTypeahead } from "src/app/shared/amrr-typeahead.interface";

export class AmrrGodown implements IAmrrTypeahead{
    sno: number;
    id: number;
    name: string;
    capacity: number;
    gstInName: string;
    gstInAddress: string;
    isActive: string;
}