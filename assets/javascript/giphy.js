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
    "The Other Guys", "Elf"
];

function GifPage() {
    this.topics = topics;
    this.currentTopic = "";
    this.currentLimit = 10;
    this.currentOffset = 0;
    this.currentQueryURL = "";
    //methods
    this.buildQueryURL = (topic, offset) => {
        this.currentTopic = topic;

        let params = $.param({
            api_key: "dc6zaTOxFJmzC",
            q: topic,
            limit: 10,
            offset: offset
        })

        return "https://api.giphy.com/v1/gifs/search?" + params;
    };
    this.buildGif = element => {
        let gifContainer = $("<div>").attr("class", "gif-container");
        let title = $("<h2>");
        title.addClass("gif-title");
        title.text(element.title);
        let a = $(`<a href="https://media0.giphy.com/media/11clOWGCHzWG7C/200_s.gif" download="download"></a>`);
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
        gifContainer.append(title)
        a.append(img);
        gifContainer.append(a); /* height="348px" width="480px"/>`);*/
        gifContainer.append(rating);

        return gifContainer;
    };
    // Function for dumping the JSON content for each button into the div
    this.displayTopic = GiphyData => {
        console.log(GiphyData);
        if (this.currentOffset === 0) {
            this.clear();
        }

        // let topicContainer = $("<div>").attr("class", "topic-container");

        for (const key in GiphyData.data) {
            if (GiphyData.data.hasOwnProperty(key)) {
                const element = GiphyData.data[key];
                // topicContainer.append(this.buildGif(element));
                $("#gif-view").prepend(this.buildGif(element));
            }
        }

        // $("#gif-view").prepend(topicContainer);
    };
    this.renderButtons = () => {
        $("#buttons-view").empty();

        for (var i = 0; i < this.topics.length; i++) {
            let a = $("<button>");
            a.addClass("topic btn-primary");
            a.attr("data-name", this.topics[i]);
            a.text(this.topics[i]);
            $("#buttons-view").append(a);
        }
    };
    this.animateGif = gif => {
        let animatedSrc = gif.dataset.animated_url;
        $(gif).attr("src", animatedSrc);
        // $(this).attr("data-currently_animated", "true");
    };
    this.stopAnimatedGif = gif => {
        let stillSrc = gif.dataset.still_url;
        $(gif).attr("src", stillSrc);
        // $(this).attr("data-currently_animated", "false");
    };
    this.clear = () => {
        $("#gif-view").empty();
    }
}

let currentGifPage = new GifPage();

$("#add-topic").on("click", event => {
    event.preventDefault();

    let topic = $("#topic-input").val().trim();
    currentGifPage.topics.push(topic);
    currentGifPage.renderButtons();
});

// $(document).on("click", ".topic", displayGifInfo);
$(document).on("click", ".topic", event => {
    currentGifPage.currentOffset = 0;
    let queryURL = currentGifPage.buildQueryURL(event.target.dataset.name, currentGifPage.currentOffset);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(currentGifPage.displayTopic);
});

$(document).on("click", "#add-more", () => {
    currentGifPage.currentOffset += 10;
    let queryURL = currentGifPage.buildQueryURL(currentGifPage.currentTopic, currentGifPage.currentOffset);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(currentGifPage.displayTopic);
});

// $(document).on("click", ".gif", function () {
//     if (this.dataset.currently_animated === "false") {
//         animateGif.call(this);
//     } else {
//         stopAnimatedGif.call(this);
//     }
// });

$(document).on("mouseover", ".gif", event => {
    currentGifPage.animateGif(event.currentTarget);
});

$(document).on("mouseout", ".gif", event => {
    currentGifPage.stopAnimatedGif(event.currentTarget);
});

currentGifPage.renderButtons();