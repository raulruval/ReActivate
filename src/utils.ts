import StatsData from "./statsData";

export default class Utils {


    static getActualDate(): string {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        // YYYY-MM-DD HH:MM:SS format
        return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    }

    static getLocalStorageData(): JSON {
        var initStats = JSON.stringify({
            "cardio": [

            ],
            "agility": [

            ]
        });
        var statsData = JSON.parse(localStorage.getItem("statsData") || initStats);
        return statsData;
    }

    static setLocalStorageData(statsData: StatsData) {
        var mydata = this.getLocalStorageData();
        mydata["cardio"].push(statsData);
        localStorage.setItem("statsData", JSON.stringify(mydata));
    }

    static getMaxStatFromStorage(workout: string): JSON {
        var mydata = this.getLocalStorageData();
        var max;

        for (var i = 0; i < mydata[workout].length; i++) {
            if (max == null || parseInt(mydata[workout][i]["_maxLevel"]) > parseInt(max["_maxLevel"]))
                max = mydata[workout][i];
        }

        return max;
    }
}
