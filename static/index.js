Vue.component("modal", {
  template: "#modal-template"
});

Vue.component("blog-articles", {
  template: "#my-template",
  props: ["datesArticles", "allTags", ""],
  data() {
    return {
      searchQuery: ""
    };
  },
  computed: {
    searchedArticles() {
      var searchRegex = new RegExp(this.searchQuery, "i");
      var searchedObj = {};

      if (this.searchQuery == "") {
        return this.datesArticles;
      }

      for (var date in this.datesArticles) {
        searchedObj[date] = this.datesArticles[date].filter(article => {
          return (
            searchRegex.test(article.tag_name) ||
            searchRegex.test(article.text) ||
            searchRegex.test(article.hour)
          );
        });
      }
      return searchedObj;
    }
  },
  mounted() {},

  methods: {
    anyArticle() {
      return this.countAllArticles() ? true : false;
    },
    countAllArticles() {
      var count = 0;
      for (var date in this.searchedArticles) {
        count += this.searchedArticles[date].length;
      }
      return count;
    },

    deleteEntry: function (deleteId) {
      fetch(`/api/entry/${deleteId}`, {
          method: "delete",
        })
        .then(res => res.json())
        .then(data => {
          console.log(data);
        })
      this.getEntry();
    }
  }
});

new Vue({
  el: "#app",
  data: {
    display: "profile",
    showModal: false,
    isEditing: true,
    selectedActivity: "",
    selectedTag: "",
    selectedLevel: "",
    selectedYear: "",
    selectedMonth: "",
    selectedDay: "",
    selectedFrom: "",
    selectedTo: "",
    from: "",
    to: "",
    years: ["2017", "2018"],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    days: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31"
    ],
    time: [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23"
    ],

    allTags: [],
    level: ["1", "2", "3", "4", "5"],

    chartData: [
      ["Travel", 0],
      ["Study", 0],
      ["Work", 0],
      ["Sleep", 0],
      ["Social Media", 0],
      ["Misc.", 0],
      ["Entertainment", 0]
    ],

    lineData: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0
    },

    datesArticles: {
      data: []
    }
  },
  mounted() {
    this.getTag();
    this.getEntry();
  },
  methods: {
    activityAdd() {
      this.display = "profile";
      this.convertToUTC();
      this.addNewEntry();
      this.getEntry();
    },

    convertToUTC() {
      val = new Date();
      this.selectedTo = val.setHours(this.to, 0, 0) / 1000;
      this.selectedFrom = val.setHours(this.from, 0, 0) / 1000;
      console.log(this.selectedFrom);
      console.log(this.selectedTo);
    },

    createChartData() {
      this.datesArticles.data.forEach(element => {
        this.chartData.forEach(e => {
          if (element.tag_name == e[0]) e[1]++;
        });
      });
    },

    createLineData() {
      this.datesArticles.data.forEach(element => {
        this.lineData[element.hour] = element.p_level;
      });
    },

    /////////////////   roshan editted
    getTag: function () {
      fetch(`/api/tag`)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.success) this.allTags = data.tags;
        })
        .catch(err => console.error(err));
    },

    addNewEntry: function () {
      fetch("/api/entry", {
          method: "post",
          body: JSON.stringify({
            to: this.selectedTo,
            from: this.selectedFrom,
            text: this.selectedActivity,
            tag_id: this.selectedTag.id,
            p_level: this.selectedLevel
          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(res => res.json())
        .then(data => {
          (this.to = ""),
          (this.from = ""),
          (this.selectedActivity = ""),
          (this.selectedTag = ""),
          (this.selectedLevel = "");
        })
        .catch(err => console.error(err));
    },

    getEntry: function () {
      fetch(`/api/entry`)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.success) {
            this.datesArticles.data = data.entries;
            this.createChartData();
            this.createLineData();
          }
        })
        .catch(err => console.error(err));
    }
  }
});