new Vue({
  el: "#app",
  data() {
    return {
      featimgposts: null,
      featimages: [],
      imgposts: null,
      images: [],
      blogposts: null,
      github: null,
      dev: null,
      travels: null,
      flies: null,
      travelimages: [],
      flightimages: [],
      updates: []
    };
  },
  watch: {
    // Watch for the value of featimgposts to change
    'featimgposts': function() {
      // Track the array size for UI purposes
      this.arraySize = this.featimgposts.length;
      // Once featimgposts gets updated, this gets executed 
      for (var i = 0; i < this.arraySize; i++) {
        var x = this.featimgposts[i].content.indexOf("href=\"");
        var y = this.featimgposts[i].content.indexOf("\"",x+6);
        this.featimages.push(this.featimgposts[i].content.substring(x+6,y));
      }
    },
    // Watch for the value of imgposts to change
    'imgposts': function() {
      // Track the array size for UI purposes
      this.arraySize = this.imgposts.length;
      // Once imgposts gets updated, this gets executed 
      for (var i = 0; i < this.arraySize; i++) {
        var x = this.imgposts[i].content.indexOf("href=\"");
        var y = this.imgposts[i].content.indexOf("\"",x+6);
        this.images.push(this.imgposts[i].content.substring(x+6,y));
        // Is the image an image?
        if(this.imgposts[i].content.substring(x+6,y).includes('.mp4')){
          this.imgposts[i].imgurl='https://jws.dev/logo.png';
        }else{
          this.imgposts[i].imgurl=this.imgposts[i].content.substring(x+6,y);
        }
      }
      this.buildUpdates();
    },
    // Watch for the value of blogposts to change
    'blogposts': function() {
      this.buildUpdates();
    },
    // Watch for the value of github to change
    'github': function() {
      this.buildUpdates();
    },
    // Watch for the value of dev to change
    'dev': function() {
      this.buildUpdates();
    },
    // Watch for the value of travels to change
    'travels': function() {
      // Track the array size for UI purposes
      this.arraySize = this.travels.length;
      // Once travelimages gets updated, this gets executed 
      for (var i = 0; i < this.arraySize; i++) {
        var x = this.travels[i].body.indexOf("src=\"");
        var y = this.travels[i].body.indexOf("\"",x+5);
        // Is the image an image?
        if(this.travels[i].body.substring(x+5,y).includes('.mp4')){
          this.travelimages.push("https://jws.dev/logo.png");
        }else{
          this.travelimages.push(this.travels[i].body.substring(x+5,y));
        }
      }
      this.buildUpdates();
    },
    // Watch for the value of flies to change
    'flies': function() {
      // Track the array size for UI purposes
      this.arraySize = this.flies.length;
      // Once flightimages gets updated, this gets executed 
      for (var i = 0; i < this.arraySize; i++) {
        var x = this.flies[i].body.indexOf("src=\"");
        var y = this.flies[i].body.indexOf("\"",x+5);
        // Is the image an image?
        if(this.flies[i].body.substring(x+5,y).includes('.mp4')){
          this.flightimages.push("https://jws.dev/logo.png");
        }else{
          this.flightimages.push(this.flies[i].body.substring(x+5,y));
        }
      }
      this.buildUpdates();
    }
  },
  methods: {
    oneMonthAgo () {
      var d = new Date();
      var m = d.getMonth();
      d.setMonth(d.getMonth() - 1);

      // If still in same month, set date to last day of 
      // previous month
      if (d.getMonth() == m) d.setDate(0);
      d.setHours(0, 0, 0);
      d.setMilliseconds(0);

      // Get the time value in milliseconds and convert to seconds
      return new Date(d);
    },
    buildUpdates () {
      this.loaded=0;
      if(typeof(this.imgposts) !== "undefined" && this.imgposts !== null){
        // If there are blogger posts, add them to the updates array
        this.loaded=this.loaded+1;
      };
      if(typeof(this.blogposts) !== "undefined" && this.blogposts !== null){
        // If there are wordpress posts, add them to the updates array
        this.loaded=this.loaded+1;
      };
      if(typeof(this.github) !== "undefined" && this.github !== null){
        // If there is github activity, add them to the updates array
        this.loaded=this.loaded+1;
      };
      if(typeof(this.dev) !== "undefined" && this.dev !== null){
        // If there is practical dev activity, add them to the updates array
        this.loaded=this.loaded+1;
      };
      if(typeof(this.travels) !== "undefined" && this.travels !== null){
        // If there are "Joe Travels" posts, add them to the updates array
        this.loaded=this.loaded+1;
      };
      if(typeof(this.flies) !== "undefined" && this.flies !== null){
        // If there are "Joe Flies" posts, add them to the updates array
        this.loaded=this.loaded+1;
      };
      // Do we have data from all 6 APIs?
      if(this.loaded==6){
        // Add recent images from the image blog
        for (var i = 0; i < this.imgposts.length; i++) {
          if(new Date(this.imgposts[i].published) >= this.oneMonthAgo())
            this.updates.push({ icon: 'fal fa-photo-video', width: 'narrowpost', published: new Date(this.imgposts[i].published), title: this.imgposts[i].title, url: this.imgposts[i].url, imgurl: this.images[i], showdate: true, service: 'Photos.jws' });
        }

        // Add recent blog posts from the wordpress site
        for (var i = 0; i < this.blogposts.length; i++) {
          if(new Date(this.blogposts[i].date) >= this.oneMonthAgo())
            // Check to see if the image is an image                      
            if(this.blogposts[i].jetpack_featured_media_url == ''){
              this.updates.push({ icon: 'fal fa-blog', width: 'widepost', published: new Date(this.blogposts[i].date), title: this.blogposts[i].title.rendered, url: this.blogposts[i].link, imgurl: 'https://jws.dev/logo.png', showdate: true, service: 'Blog.jws', serviceurl: 'https://blog.jws.app', excerpt: this.blogposts[i].excerpt.rendered });
            }else{
              this.updates.push({ icon: 'fal fa-blog', width: 'widepost', published: new Date(this.blogposts[i].date), title: this.blogposts[i].title.rendered, url: this.blogposts[i].link, imgurl: this.blogposts[i].jetpack_featured_media_url, showdate: true, service: 'Blog.jws', serviceurl: 'https://blog.jws.app', excerpt: this.blogposts[i].excerpt.rendered });
            }
        }

        // Add recent github activity from github
        for (var i = 0; i < 10; i++) {
          if(new Date(this.github[i].created_at) >= this.oneMonthAgo())
            this.updates.push({ icon: 'fab fa-github', width: 'narrowpost', published: new Date(this.github[i].created_at), title: this.github[i].type+': '+this.github[i].repo.name, url: this.github[i].repo.url, imgurl: './img/github.png', showdate: true, service: 'Github', serviceurl: 'https://github.com/steinbring/' });
        }

        // Add recent posts from the practical dev
        console.log(this.dev);
        for (var i = 0; i < this.dev.length; i++) {
          if(new Date(this.dev[i].published_at) >= this.oneMonthAgo())
            this.updates.push({ icon: 'fab fa-dev', width: 'widepost', published: new Date(this.dev[i].published_timestamp), title: this.dev[i].title, url: this.dev[i].url, imgurl: this.dev[i].social_image, showdate: true, service: 'DEV', serviceurl: 'https://dev.to/steinbring/', excerpt: this.dev[i].description });
        }

        // Add recent images from the "Joe Travels" blog
        for (var i = 0; i < 10; i++) {
          if(new Date(this.travels[i].date) >= this.oneMonthAgo())
            this.updates.push({ icon: 'fal fa-hiking', width: 'narrowpost', published: new Date(this.travels[i].date), title: this.travels[i].summary, url: this.travels[i].post_url, imgurl: this.travelimages[i], showdate: true, service: 'Joe Travels', serviceurl: 'https://travels.jws.app/' });
        }

        // Add recent images from the "Joe Flies" blog
        for (var i = 0; i < 10; i++) {
          if(this.flies.length > i+1){
            if(new Date(this.flies[i].date) >= this.oneMonthAgo())
              this.updates.push({ icon: 'fal fa-drone-alt', width: 'narrowpost', published: new Date(this.flies[i].date), title: this.flies[i].summary, url: this.flies[i].post_url, imgurl: this.flightimages[i], showdate: true, service: 'Joe Flies', serviceurl: 'https://flies.jws.app/' });
          }
        }
      };
      // Sort updates by date (descending)
      this.updates.sort(function(a, b) {
          return b.published - a.published;
      });
    }
  },
  mounted() {
    // Get the featured image posts from the blogger site
    // this requires an API key
    axios
    .get("https://www.googleapis.com/blogger/v3/blogs/3412726727067752443/posts/search?q=label:fp&key=AIzaSyDMDCj74G_V9RzYRUXvQLsK2AWcob7FsKw")
      .then(response=> (this.featimgposts = response.data.items));
    // Get all image posts from the blogger site
    // this requires an API key
    axios
    .get("https://www.googleapis.com/blogger/v3/blogs/3412726727067752443/posts/search?key=AIzaSyDMDCj74G_V9RzYRUXvQLsK2AWcob7FsKw")
      .then(response=> (this.imgposts = response.data.items));
    // Get posts from the wordpress blog
    axios
    .get("https://blog.jws.app/wp-json/wp/v2/posts")
      .then(response=> (this.blogposts = response.data));
    // Get github commits
    axios
    .get("https://api.github.com/users/steinbring/events")
      .then(response=> (this.github = response.data));
    // Get dev posts
    axios
    .get("https://dev.to/api/articles?username=steinbring")
      .then(response=> (this.dev = response.data));
    // Get travels.jws.app posts
    axios
    .get("https://api.tumblr.com/v2/blog/travels.jws.app/posts?api_key=vBP9f1qX2rROLMtFcjCRTIfleb0HOcArIs9Ui62oidzQItV63m")
      .then(response=> (this.travels = response.data.response.posts));
    // Get flies.jws.app posts
    axios
    .get("https://api.tumblr.com/v2/blog/flies.jws.app/posts?api_key=vBP9f1qX2rROLMtFcjCRTIfleb0HOcArIs9Ui62oidzQItV63m")
      .then(response=> (this.flies = response.data.response.posts));
  }
});