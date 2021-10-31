export default class StatsData {
    private _workout: string;
    private _date: string;
    private _maxLevel: number;
    private _touchedMarkers: number;
    private _untouchedMarkers: number;
    private _errorTouchedMarkers: number;

    constructor(workout: string, date: string, maxLevel: number, touchedMarkers: number, untouchedMarkers: number, errorTouchedMarkers: number) {
        this._workout = workout;
        this._date = date;
        this._maxLevel = maxLevel;
        this._touchedMarkers = touchedMarkers;
        this._untouchedMarkers = untouchedMarkers;
        this._errorTouchedMarkers = errorTouchedMarkers;
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
    public get errorTouchedMarkers(): number {
        return this._errorTouchedMarkers;
    }
    public set errorTouchedMarkers(value: number) {
        this._errorTouchedMarkers = value;
    }



    // setUntouchedMarkers(untouchedMarkers: number){
    //     this.untouchedMarkers = untouchedMarkers;
    // }

    // setErrorTouchedMarkers(errorTouchedMarkers: number){
    //     this.errorTouchedMarkers = errorTouchedMarkers;
    // }

    // setTouchedMarkers(touchedMarkers: number){
    //     this.touchedMarkers = touchedMarkers;
    // }

    // setMaxLevel(maxLevel: number){
    //     this.maxLevel = maxLevel;
    // }


}

