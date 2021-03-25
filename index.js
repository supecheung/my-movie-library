// global library
let movieLibrary = [];
let currentId = 0;

// the constructor
function Movie(obj) {
    this.id = obj.id;
    this.title = obj.title;
    this.director = obj.director;
    this.year = obj.year;
    this.rating = obj.rating;
    this.watched = obj.watched;
    this.comment = obj.comment;
    this.imageURL = obj.imageURL;
}

// Selectors
const addMovieButton = document.querySelector("#add-movie-button");
const addMovieModal = document.querySelector("#add-movie-modal");
const submitButton = document.querySelector("#submit-button");
const cancelButton = document.querySelector("#cancel-button");
const modalBackground = document.querySelector("#modal-background");

// basic events
modalBackground.addEventListener("click", closeModal);
cancelButton.addEventListener("click", closeModal);
addMovieButton.addEventListener("click", () => {
    openModal();
});
submitButton.addEventListener("click", (event) => {
    handleSubmissionEvent(event);
});

function handleSubmissionEvent(event) {
    event.preventDefault();
    
    if (validateForm()) {
        submitHandler();
    }
}

function submitHandler() {
    // get form data
    const formData = getFormInputs();

    // convert form data to movie object
    const newMovie = new Movie(formData);

    const replaceStatus = checkIfReplace(newMovie);
    if (replaceStatus >= 0) {
        movieLibrary.splice(replaceStatus, 1, newMovie);
    } else {
        movieLibrary.push(newMovie);
    }

    // update id
    updateId();

    // close and reset modal
    closeModal();
    changeFormToSubmit();

    // render
    render();
}

// checks if the id already exists previously
function checkIfReplace(movieObj) {
    for (let i = 0; i < movieLibrary.length; i++) {
        if (movieLibrary[i].id === movieObj.id) {
            return i;
        }
    }

    return -1;
}

function getFormInputs() {
    // form input selectors
    const id = currentId;
    const title = document.querySelector("#title-input").value;
    const director = document.querySelector("#director-input").value;
    const year = document.querySelector("#year-input").value;
    const rating = document.querySelector("#rating-input").value;
    const watched = document.querySelector("#watched-input").checked;
    const comment = document.querySelector("#comment-input").value;
    const imageURL = document.querySelector("#image-input").value;

    return {
        id, title, director, year, rating, watched, comment, imageURL
    }
}

function openModal() {
    const modal = document.querySelector("#add-movie-modal");
    modal.style.display = 'block';
}

function closeModal() {
    //get modal selector
    const modal = document.querySelector("#add-movie-modal");
    const modalForm = document.querySelector("#add-movie-form");
    modal.style.display = 'none';
    modalForm.reset();

    // clean out any lag on the currentId that may arise
    updateId();

    // revert form to original
    changeFormToSubmit();
}

function validateForm() {
    // get year for year validatoin
    const currentYear = new Date().getFullYear();

    const formData = getFormInputs();
    if (formData.title === "") {
        alert("Please enter a movie title.");
        return false;
    } else if (formData.year !== "" && (formData.year < 1888 || formData.year > currentYear)) {
        alert("Pleae enter a valid year between 1888 and " + currentYear + ".");
        return false;
    } else if (formData.rating !== "" && (formData.rating < 1 || formData.rating > 10)) {
        alert("Please enter a valid rating between 1-10.");
        return false;
    }

    return true;
}

//update id to be one above the highest value in the array
function updateId() {
    let champion = 0;
    for (let movie of movieLibrary) {
        if (movie.id > champion) {
            champion = movie.id;
        }
    }

    currentId = champion + 1;
}


// handle side switching
const movies = document.querySelectorAll(".movie");
movies.forEach(movie => movie.addEventListener("mousedown", event => {
    switchMovieSide(event);
}));

//switch from side one to side two
function switchMovieSide(event) {

    //make sure that what is clicked are not the edit buttons
    if (event.target.classList.contains("edit-movie") || event.target.classList.contains("delete-movie")) {
        return;
    }

    const target = event.currentTarget; //only get the '.movie' target and not its children
    target.classList.toggle("show-side-1");
    const targetSide1 = target.querySelector(".side-1");
    const targetSide2 = target.querySelector(".side-2");

    if (target.classList.contains("show-side-1")) {
        targetSide1.style.display = "block";
        targetSide2.style.display = 'none';
    } else {
        targetSide1.style.display = 'none';
        targetSide2.style.display = 'block';
    }
}

function showMovieControls(event) {
    const target = event.currentTarget;
    const movieControls = target.querySelector(".movie-controls");
    movieControls.style.display = "flex";
}

function hideMovieControls(event) {
    const target = event.currentTarget;
    const movieControls = target.querySelector(".movie-controls");
    movieControls.style.display = "none";
}

// create a DOM element for each movie
function createMovie(movieObj) {
    const moviesSection = document.querySelector("#movies");

    const containerDiv = document.createElement("div");
    const side1 = document.createElement("div");
    const side1Title = document.createElement("div");
    const side1Year = document.createElement("span");
    const side1Img = document.createElement("img");
    const side1Rating = document.createElement("div");
    const side2 = document.createElement("div");
    const side2Director = document.createElement("div");
    const side2DirectorBr = document.createElement("br");
    const side2DirectorSpan = document.createElement("span");
    const side2Comments = document.createElement("div");
    const side2CommentsBr = document.createElement("br");
    const side2CommentsSpan = document.createElement("span");
    const movieControls = document.createElement("div");
    const movieControlsEdit = document.createElement("button");
    const movieControlsDelete = document.createElement("button");

    containerDiv.setAttribute("id", movieObj.id);
    containerDiv.classList.add("movie");
    if (movieObj.watched) {
        containerDiv.classList.add("watched");
    }
    containerDiv.classList.add("show-side-1");

    // round rating
    movieObj.rating = Number(movieObj.rating).toFixed(1);

    console.log(movieObj.rating);

    side1.classList.add("side-1");
    side1Title.classList.add("title");
    side1Title.textContent = movieObj.title;
    side1Year.classList.add("year");
    side1Year.textContent = movieObj.year;
    side1Img.setAttribute("src", movieObj.imageURL);
    side1Rating.classList.add("rating");
    side1Rating.textContent = movieObj.rating;

    side2.classList.add("side-2");
    side2Director.classList.add("director");
    side2Director.textContent = "Directed by: ";
    side2DirectorSpan.classList.add("director-name");
    side2DirectorSpan.textContent = movieObj.director;
    side2Comments.classList.add("comments");
    side2Comments.textContent = "Comment: ";
    side2CommentsSpan.classList.add("comment");
    side2CommentsSpan.textContent = movieObj.comment;

    movieControls.classList.add("movie-controls");
    movieControlsEdit.classList.add("edit-movie");
    movieControlsEdit.textContent = "Edit";
    movieControlsDelete.classList.add("delete-movie");
    movieControlsDelete.textContent = "Delete";

    // check if year is empty
    if (side1Year.textContent !== "") {
        side1Title.appendChild(side1Year);
    }
    side1.appendChild(side1Title);
    side1.appendChild(side1Img);
    side1.appendChild(side1Rating);

    side2Director.appendChild(side2DirectorBr);
    side2Director.appendChild(side2DirectorSpan);
    side2Comments.appendChild(side2CommentsBr);
    side2Comments.appendChild(side2CommentsSpan);
    side2.appendChild(side2Director);
    side2.appendChild(side2Comments);

    movieControls.appendChild(movieControlsEdit);
    movieControls.appendChild(movieControlsDelete);

    containerDiv.appendChild(side1);
    containerDiv.appendChild(side2);
    containerDiv.appendChild(movieControls);

    // add hover effects
    containerDiv.addEventListener("mouseover", event => {
        showMovieControls(event);
    });
    containerDiv.addEventListener("mouseout", event => {
        hideMovieControls(event);
    })

    // add flip effects
    containerDiv.addEventListener("mousedown", event => {
        switchMovieSide(event);
    })

    // vivify delete button
    movieControlsDelete.addEventListener("click", () => {
        movieDeleteButtonHandler(movieObj);

    });

    // vivify edit button
    movieControlsEdit.addEventListener("click", () => {
        movieEditButtonHandler(movieObj);

    });


    moviesSection.appendChild(containerDiv);
}

// render each element in the library
function render() {
    //first, clear previous
    const movieSection = document.querySelector("#movies");
    while (movieSection.firstChild) {
        movieSection.removeChild(movieSection.childNodes[0]);
    }

    //render element
    movieLibrary.forEach(movie => {
        createMovie(movie);
    })

    // update info 
    updateInfo();
}

// handler for the button to delete movie
function movieDeleteButtonHandler(movieObj) {
    movieLibrary = movieLibrary.filter(movie => movie.id !== movieObj.id);
    render();
}

// handles the editing of a movie
// open modal and replace previous spot in the library
function movieEditButtonHandler(movieObj) {
    openModal();

    // prefill form with details
    const title = document.querySelector("#title-input");
    title.value = movieObj.title;
    const director = document.querySelector("#director-input");
    director.value = movieObj.director;
    const year = document.querySelector("#year-input");
    year.value = movieObj.year;
    const rating = document.querySelector("#rating-input");
    rating.value = movieObj.rating;
    const watched = document.querySelector("#watched-input");
    watched.checked = movieObj.watched;
    const comment = document.querySelector("#comment-input");
    comment.value = movieObj.comment;
    const imageURL = document.querySelector("#image-input");
    imageURL.value = movieObj.imageURL;

    // edit form name
    changeFormToEdit();

    // change currentID to this movieObj.id
    currentId = movieObj.id;
    // in submitHandler, if a matching id in array, replace that item
    // always make currentID one above the highest in the array
    // in closeModal, update currentID to be the highest as well to handle cases that the edit window closed prematurely
}

function changeFormToEdit() {
    // edit form name
    const formTitle = document.querySelector("form h2");
    const formSubmit = document.querySelector("#submit-button");
    formTitle.textContent = "Edit Movie";
    formSubmit.textContent = "Edit Movie";
}

function changeFormToSubmit() {
    // edit form name
    const formTitle = document.querySelector("form h2");
    const formSubmit = document.querySelector("#submit-button");
    formTitle.textContent = "Add Movie";
    formSubmit.textContent = "Add Movie";
}

// info button
const infoButton = document.querySelector("#toggle-info-button");
infoButton.addEventListener("click", infoButtonHandler);

function infoButtonHandler() {
    // implement info toggling
    infoToggleShow();

    updateInfo();

}

function infoToggleShow() {
    const infoSection = document.querySelector("#movies-info");
    infoSection.classList.toggle("movies-info-show");
    if (infoSection.classList.contains("movies-info-show")) {
        infoSection.style.display = "block";
    } else {
        infoSection.style.display = "none";
    }
}


function updateInfo() {
    let totalMovies = 0;
    let totalWatched = 0;

    const totalMoviesDOM = document.querySelector("#total-movies");
    const totalWatchedDOM = document.querySelector("#watched-movies");
    const totalUnwatchedDOM = document.querySelector("#unwatched-movies");

    totalMovies = movieLibrary.length;
    for (let movie of movieLibrary) {
        if (movie.watched === true) totalWatched += 1;
    }

    totalMoviesDOM.textContent = totalMovies;
    totalWatchedDOM.textContent = totalWatched;
    totalUnwatchedDOM.textContent = totalMovies - totalWatched;
}

// implement movie sorting
const sortControl = document.querySelector("#sort-control");
const sortControlOrder = document.querySelector("#sort-control-order");

sortControl.addEventListener("change", () => {
    console.log("YEt")
})