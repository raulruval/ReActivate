export default class StatsData {
    private _workout: string;
    private _date: string;
    private _maxLevel: number;
    private _touchedMarkers: number;
    private _untouchedMarkers: number;
    private _totalTouchableMarkers: number;

    constructor(workout: string, date: string, maxLevel: number, touchedMarkers: number, untouchedMarkers: number, totalTouchableMarkers: number) {
        this._workout = workout;
        this._date = date;
        this._maxLevel = maxLevel;
        this._touchedMarkers = touchedMarkers;
        this._untouchedMarkers = untouchedMarkers;
        this._totalTouchableMarkers = totalTouchableMarkers;
    }

    public get workout(): string {
        return this._workout;
    }
    public set workout(value: string) {
        this._workout = value;
    }
    public get date(): string {
        return this._date;
    }
    public set date(value: string) {
        this._date = value;
    }
    public get maxLevel(): number {
        return this._maxLevel;
    }
    public set maxLevel(value: number) {
        this._maxLevel = value;
    }
    public get touchedMarkers(): number {
        return this._touchedMarkers;
    }
    public set touchedMarkers(value: number) {
        this._touchedMarkers = value;
    }
    public get untouchedMarkers(): number {
        return this._untouchedMarkers;
    }
    public set untouchedMarkers(value: number) {
        this._untouchedMarkers = value;
    }

    public get totalTouchableMarkers(): number {
        return this._untouchedMarkers;
    }
    public set totalTouchableMarkers(value: number) {
        this._untouchedMarkers = value;
    }


}

