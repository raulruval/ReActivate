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
            "stats": []
        });
        var statsData = JSON.parse(localStorage.getItem("statsData") || initStats);
        return statsData;
    }

    static getLocalStorageByDate(): [] {
        var mydata = this.getLocalStorageData();
        var sortedStats: [] = [];
        sortedStats = mydata["stats"];
        sortedStats.sort((a: any, b: any) => {
            return   new Date(b._date).valueOf() - new Date(a._date).valueOf();
        })
        console.log(sortedStats);
        return sortedStats;
    }

    static setLocalStorageData(statsData: StatsData) {
        var mydata = this.getLocalStorageData();
        mydata["stats"].push(statsData);
        localStorage.setItem("statsData", JSON.stringify(mydata));
    }

    static getMaxStatFromStorage(): JSON {
        var mydata = this.getLocalStorageData();
        var max;
        if (mydata["stats"]?.length) {
            for (var i = 0; i < mydata["stats"].length; i++) {
                if (max == null || parseInt(mydata["stats"][i]["_maxLevel"]) > parseInt(max["_maxLevel"]))
                    max = mydata["stats"][i];
            }
        }
        return max;
    }

    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
}
