// Initial array of movies
const topics = [
    "Game of Thrones",
    "I Love You, Man",
    "Rick and Morty",
    "Spongebob",
    "Step Brothers",
    "South Park",
    "40 Year Old Virgin",
    "Borat",
    "Family Guy",
    "Parks and Recreation",
    "Talladega Nights",
    "Forgetting Sarah Marshall",
    "The Other Guys", 
    "Elf"
];

function GifPage() {
    this.topics = topics;
    this.currentTopic = "";
    this.currentLimit = 10;
    this.currentOffset = 0;
    this.currentQueryURL = "";
    // *** methods ***
    // construct url needed to query giphy api
    this.buildQueryURL = (topic, offset) => {
        this.currentTopic = topic;

        // formats object into url string
        let params = $.param({
            api_key: "dc6zaTOxFJmzC",
            q: topic,
            limit: 10,
            offset: offset
        })

        return "https://api.giphy.com/v1/gifs/search?" + params;
    };
    // creates a div container with element for the gif title, image, and rating
    this.buildGif = element => {
        let gifContainer = $("<div>").attr("class", "gif-container");
        let title = $("<h2>");
        title.addClass("gif-title");
        title.text(element.title);
        let img = $("<img>");
        img.addClass("gif");
        let stillSrc = element.images.fixed_height_still.url;
        let animatedSrc = element.images.fixed_height.url;
        img.attr({
            "src": stillSrc,
            "data-still_url": stillSrc,
            "data-animated_url": animatedSrc,
            "data-currently_animated": "false"
        });
        let rating = $("<p>");
        rating.attr("class", "rating");
        rating.text(`Rating: ${element.rating.toUpperCase()}`);
        gifContainer.append(title);
        gifContainer.append(img); 
        gifContainer.append(rating);

        return gifContainer;
    };
    // function for dumping the JSON content for each button into the div
    this.displayTopic = GiphyData => {
        console.log(GiphyData);

        // clear all current gifs if the offset is 0, meaning a new topic was selected
        if (this.currentOffset === 0) {
            this.clear();
        }

        // iterate through each of the 10 gifs queried from the api, adding them to the window
        for (const key in GiphyData.data) {
            if (GiphyData.data.hasOwnProperty(key)) {
                const element = GiphyData.data[key];
                $("#gif-view").prepend(this.buildGif(element));
            }
        }
    };
    // dynamically display buttons for each of the topics
    this.renderButtons = () => {
        $("#buttons-view").empty();

        for (var i = 0; i < this.topics.length; i++) {
            let a = $("<button>");
            a.addClass("topic btn btn-info");
            a.attr("data-name", this.topics[i]);
            a.text(this.topics[i]);
            $("#buttons-view").append(a);
        }
    };
    // animated current gif
    this.animateGif = gif => {
        let animatedSrc = gif.dataset.animated_url;
        $(gif).attr("src", animatedSrc);
    };
    // stop animation for current gif
    this.stopAnimatedGif = gif => {
        let stillSrc = gif.dataset.still_url;
        $(gif).attr("src", stillSrc);
    };
    // empty all currently displayed gifs
    this.clear = () => {
        $("#gif-view").empty();
    }
}

let currentGifPage = new GifPage();

// event handler for adding topics
$("#add-topic").on("click", event => {
    event.preventDefault();

    let topic = $("#topic-input").val().trim();
    currentGifPage.topics.push(topic);
    currentGifPage.renderButtons();
});

// dynamic event handler for querying and displaying gifs related to selected topic
$(document).on("click", ".topic", event => {
    currentGifPage.currentOffset = 0;
    let queryURL = currentGifPage.buildQueryURL(event.target.dataset.name, currentGifPage.currentOffset);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(currentGifPage.displayTopic);
});

// dynamic event handler for adding 10 more gifs for the current topic
$(document).on("click", "#add-more", () => {
    currentGifPage.currentOffset += 10;
    let queryURL = currentGifPage.buildQueryURL(currentGifPage.currentTopic, currentGifPage.currentOffset);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(currentGifPage.displayTopic);
});

// event handler for animating gif when mouse hovers over it
$(document).on("mouseover", ".gif", event => {
    currentGifPage.animateGif(event.currentTarget);
});

// event handler for stopping animated gif when mouse is no longer hovering over it
$(document).on("mouseout", ".gif", event => {
    currentGifPage.stopAnimatedGif(event.currentTarget);
});

// initially display button for each topic
currentGifPage.renderButtons();