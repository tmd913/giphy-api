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

// Function for dumping the JSON content for each button into the div
function displayGifInfo() {

    let topic = this.dataset.name;
    let limit = 10;
    let offset = 0;
    let queryURL = `https://api.giphy.com/v1/gifs/search?q=${topic}&api_key=dc6zaTOxFJmzC&limit=${limit}&${offset}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(response => {
        console.log(response);
        let topicContainer = $("<div>").attr("id", "topic-container");
        for (const key in response.data) {
            if (response.data.hasOwnProperty(key)) {
                const element = response.data[key];
                let stillSrc = element.images.fixed_height_still.url;
                let animatedSrc = element.images.fixed_height.url;
                let img = $("<img>");
                img.addClass("gif");
                img.attr({
                    "src": stillSrc, 
                    "data-still_url": stillSrc, 
                    "data-animated_url": animatedSrc, 
                    "data-currently_animated": "false"
                });
                topicContainer.append(img); /* height="348px" width="480px"/>`);*/
                $("#gif-view").prepend(topicContainer);
            }
        }
    });

}

function renderButtons() {
    $("#buttons-view").empty();

    for (var i = 0; i < topics.length; i++) {
        let a = $("<button>");
        a.addClass("topic");
        a.attr("data-name", topics[i]);
        a.text(topics[i]);
        $("#buttons-view").append(a);
    }
}

function animateGif () {
    let animatedSrc = this.dataset.animated_url;
    $(this).attr("src", animatedSrc);
    // $(this).attr("data-currently_animated", "true");
}

function stopAnimatedGif () {
    let stillSrc = this.dataset.still_url;
    $(this).attr("src", stillSrc);
    // $(this).attr("data-currently_animated", "false");
}

$("#add-topic").on("click", event => {
    event.preventDefault();

    let topic = $("#topic-input").val().trim();
    topics.push(topic);
    renderButtons();
});

$(document).on("click", ".topic", displayGifInfo);

// $(document).on("click", ".gif", function () {
//     if (this.dataset.currently_animated === "false") {
//         animateGif.call(this);
//     } else {
//         stopAnimatedGif.call(this);
//     }
// });

$(document).on("mouseover", ".gif", animateGif);

$(document).on("mouseout", ".gif", stopAnimatedGif);

renderButtons();