// GLOBAL MOVIE LIBRARY

let movieLibrary = [];
let currentId = 0;


// MOVIE CONSTRUCTOR

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


// ADD MOVIE MODAL

const modal = (function() {
    // SELECTORS
    const addMovieButton = document.querySelector("#add-movie-button");
    const cancelButton = document.querySelector("#cancel-button");
    const modalBackground = document.querySelector("#modal-background");
    const addMovieForm = document.querySelector("#add-movie-form");
    const yearInput = document.querySelector("#year-input");

    // Update max year to be the current year
    const currentYear = new Date().getFullYear();
    yearInput.setAttribute("max", currentYear);

    // BASIC EVENTS
    modalBackground.addEventListener("click", closeModal);
    cancelButton.addEventListener("click", closeModal);
    addMovieButton.addEventListener("click", () => {
        openModal();
    });

    // SUBMIT FORM
    addMovieForm.addEventListener("submit", (event) => {
        event.preventDefault();
        submitHandler();
    });

    // MODAL FUNCTIONS
    function openModal() {
        const modal = document.querySelector("#add-movie-modal");
        modal.style.display = 'block';
    
        // Focus on the title input first 
        const titleInput = document.querySelector("#title-input");
        titleInput.focus();
    }
    
    function closeModal() {
        const modal = document.querySelector("#add-movie-modal");
        const modalForm = document.querySelector("#add-movie-form");
        modal.style.display = 'none';
        modalForm.reset();
    
        // Make sure the currentID is up-to-date
        updateId();
    
        // Revert form to original (in case it is still 'Edit Form')
        changeFormToSubmit();
    }

    // Exports
    return {
        openModal, closeModal
    }
})();


// FORM

function submitHandler() {
    // Get form data
    const formData = getFormInputs();

    // Feed data into the Movie constructor
    const newMovie = new Movie(formData);

    // Check if the form was an Edit event (by comparing Ids)
    const replaceStatus = checkIfReplace(newMovie);
    if (replaceStatus >= 0) {
        movieLibrary.splice(replaceStatus, 1, newMovie);
    } else {
        movieLibrary.push(newMovie);
    }

    // Update Id to the highest in the list
    updateId();

    // Close modal
    modal.closeModal();

    // Sort added object accordingly 
    sortControls.sortControlHandler();

    // Re-render all the objects
    render();
}

// CHECK FOR EXISTING ID IN THE LIBRARY; IF TRUE, RETURNS IT
function checkIfReplace(movieObj) {
    for (let i = 0; i < movieLibrary.length; i++) {
        if (movieLibrary[i].id === movieObj.id) {
            return i;
        }
    }

    return -1;
}

// RETRIEVE FORM DATA
function getFormInputs() {
    // Selectors
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


// UPDATE ID TO BE THE HIGHEST IN THE LIBRARY
function updateId() {
    let champion = 0;
    for (let movie of movieLibrary) {
        if (movie.id > champion) {
            champion = movie.id;
        }
    }

    currentId = champion + 1;
}


// MOVIE ELEMENT

// HANDLE SIDE-SWITCHING FOR MOVIE ELEMENTS
function switchMovieSide(event) {
    // Ignore clicks on the Edit and Delete buttons
    if (event.target.classList.contains("edit-movie") || event.target.classList.contains("delete-movie")) {
        return;
    }

    // Ensure that child elements don't recieve the event
    const target = event.currentTarget; 
    target.classList.toggle("show-side-1");
    const targetSide1 = target.querySelector(".side-1");
    const targetSide2 = target.querySelector(".side-2");

    // Side switching
    if (target.classList.contains("show-side-1")) {
        targetSide1.style.display = "block";
        targetSide2.style.display = 'none';
    } else {
        targetSide1.style.display = 'none';
        targetSide2.style.display = 'block';
    }
}

// Show Edit and Delete When User Hovers Over Movie Element 
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

// CREATE DOM ELEMENT FOR MOVIE
function createMovie(movieObj) {
    // Movies section selector
    const moviesSection = document.querySelector("#movies");

    // Preliminary logic
    // Make image black if none is provided
    if (!movieObj.imageURL) {
        movieObj.imageURL = 'https://images.unsplash.com/photo-1590272456521-1bbe160a18ce?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
    }
    
    // Create DOM elements
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

    // Container div
    containerDiv.setAttribute("id", movieObj.id);
    containerDiv.classList.add("movie");
    if (movieObj.watched) {
        containerDiv.classList.add("watched");
    }
    containerDiv.classList.add("show-side-1");

    // Side 1
    side1.classList.add("side-1");
    side1Title.classList.add("title");
    side1Title.textContent = movieObj.title;
    side1Year.classList.add("year");
    side1Year.textContent = movieObj.year;
    side1Img.setAttribute("src", movieObj.imageURL);
    side1Rating.classList.add("rating");
    side1Rating.textContent = movieObj.rating;
    // Add year beside title if it exists
    if (side1Year.textContent !== "") {
        side1Title.appendChild(side1Year);
    }

    // Side 2
    side2.classList.add("side-2");
    side2Director.classList.add("director");
    side2Director.textContent = "Directed by: ";
    side2DirectorSpan.classList.add("director-name");
    side2DirectorSpan.textContent = movieObj.director;
    side2Comments.classList.add("comments");
    side2Comments.textContent = "Comment: ";
    side2CommentsSpan.classList.add("comment");
    side2CommentsSpan.textContent = movieObj.comment;

    // Movie controls
    movieControls.classList.add("movie-controls");
    movieControlsEdit.classList.add("edit-movie");
    movieControlsEdit.textContent = "Edit";
    movieControlsDelete.classList.add("delete-movie");
    movieControlsDelete.textContent = "Delete";

    // Side 1 append children
    side1.appendChild(side1Title);
    side1.appendChild(side1Img);
    side1.appendChild(side1Rating);

    // Side2 append children
    side2Director.appendChild(side2DirectorBr);
    side2Director.appendChild(side2DirectorSpan);
    side2Comments.appendChild(side2CommentsBr);
    side2Comments.appendChild(side2CommentsSpan);
    side2.appendChild(side2Director);
    side2.appendChild(side2Comments);

    // Movie controls append children
    movieControls.appendChild(movieControlsEdit);
    movieControls.appendChild(movieControlsDelete);

    // Container append children
    containerDiv.appendChild(side1);
    containerDiv.appendChild(side2);
    containerDiv.appendChild(movieControls);

    // Add hover events to show controls
    containerDiv.addEventListener("mouseover", event => {
        showMovieControls(event);
    });
    containerDiv.addEventListener("mouseout", event => {
        hideMovieControls(event);
    })

    // Add flip event
    containerDiv.addEventListener("mousedown", event => {
        switchMovieSide(event);
    })

    // Logic for the Delete button
    movieControlsDelete.addEventListener("click", () => {
        movieDeleteButtonHandler(movieObj);

    });

    // Logic for the Edit Button
    movieControlsEdit.addEventListener("click", () => {
        movieEditButtonHandler(movieObj);

    });

    // Finally, add to the DOM
    moviesSection.appendChild(containerDiv);
}


// DELETE MOVIE FROM LIBRARY
function movieDeleteButtonHandler(movieObj) {
    movieLibrary = movieLibrary.filter(movie => movie.id !== movieObj.id);
    render();
}

// EDIT MOVIE 
function movieEditButtonHandler(movieObj) {
    modal.openModal();

    // Prefill form for convenience
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

    // Change 'Add' in the form to 'Edit'
    changeFormToEdit();

    // Make the currentID to the element to be edited
    currentId = movieObj.id;
}

// CHANGE 'ADD' TO 'EDIT'
function changeFormToEdit() {
    // edit form name
    const formTitle = document.querySelector("form h2");
    const formSubmit = document.querySelector("#submit-button");
    formTitle.textContent = "Edit Movie";
    formSubmit.textContent = "Edit Movie";
}

// REVERT BACK TO 'ADD'
function changeFormToSubmit() {
    // edit form name
    const formTitle = document.querySelector("form h2");
    const formSubmit = document.querySelector("#submit-button");
    formTitle.textContent = "Add Movie";
    formSubmit.textContent = "Add Movie";
}


// INFO BUTTON (SHOWS MOVIE DATA)

const info = (function() {
    // Button selector
    const infoButton = document.querySelector("#toggle-info-button");
    infoButton.addEventListener("click", infoButtonHandler);

    function infoButtonHandler() {
        // Toggle info display
        infoToggleShow();

        // Update whenever something in the DOM renders
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


    // Info updater
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

    return {
        updateInfo
    }
})();


// SORT CONTROLS

const sortControls = (function() {
    const sortControl = document.querySelector("#sort-control");
    const sortControlOrder = document.querySelector("#sort-control-order");
    
    sortControl.addEventListener("change", () => {
        sortControlHandler();
    });
    
    sortControlOrder.addEventListener("change", () => {
        sortControlHandler();
    });
    
    function sortControlHandler() {
        const sortControl = document.querySelector("#sort-control");
        const sortControlOrder = document.querySelector("#sort-control-order");
    
        const sortControlValue = sortControl.value;
        const sortControlOrderValue = sortControlOrder.value;
        
        // check scenarios
        if (sortControlValue === 'order-added') {
            if (sortControlOrderValue === 'desc') {
                movieLibrary = movieLibrary.sort((a, b) => b.id - a.id);
                render();
            } else {
                movieLibrary = movieLibrary.sort((a, b) => a.id - b.id);
                render();
            }
        } else if (sortControlValue === 'director') {
            if (sortControlOrderValue === 'desc') {
                movieLibrary = movieLibrary.sort((a, b) => b.director.localeCompare(a.director));
                render();
            } else {
                movieLibrary = movieLibrary.sort((a, b) => a.director.localeCompare(b.director));
                render();
            }
        } else if(sortControlValue === 'title') {
            if (sortControlOrderValue === 'desc') {
                movieLibrary = movieLibrary.sort((a, b) => b.title.localeCompare(a.title));
                render();
            } else {
                movieLibrary = movieLibrary.sort((a, b) => a.title.localeCompare(b.title));
                render();
            }
        } else if(sortControlValue === 'year') {
            if (sortControlOrderValue === 'desc') {
                movieLibrary = movieLibrary.sort((a, b) => b.year - a.year);
                render();
            } else {
                movieLibrary = movieLibrary.sort((a, b) => a.year - b.year);
                render();
            }
        } else if (sortControlValue === 'rating') {
            if (sortControlOrderValue === 'desc') {
                movieLibrary = movieLibrary.sort((a, b) => b.rating - a.rating);
                render();
            } else {
                movieLibrary = movieLibrary.sort((a, b) => a.rating - b.rating);
                render();
            }
        }
    }    

    // EXPORT FUNCTIONS
    return {
        sortControlHandler
    }
})();


// RENDER EACH ELEMENT
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
    info.updateInfo();

    // set to local
    setLocalStorage();
}


// LOCAL STORAGE

// SET
function setLocalStorage() {
    localStorage.setItem('movieLibrary', JSON.stringify(movieLibrary));
}

// RETRIEVE
function getLocalStorage() {
    const getItem = localStorage.getItem("movieLibrary");
    if (!getItem) {
        setLocalStorage(); 
        render();
    } else {
        movieLibrary = JSON.parse(getItem);
        render();
    }

    // Update the currentID, just in case
    updateId(); 
}

getLocalStorage();

