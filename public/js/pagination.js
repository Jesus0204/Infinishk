const paginationNumbers = document.getElementById("pagination-numbers");
const paginatedList = document.getElementById("pagination-list");
const listItems = document.querySelectorAll("#pagination-content");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");

const paginationLimit = 5;
console.log(listItems);
const pageCount = Math.ceil(listItems.length / paginationLimit);
let currentPage;

const appendPageNumber = (index) => {
    const pageNumber = document.createElement("a");
    pageNumber.className = "pagination-link";
    pageNumber.classList.add('pag-1');
    pageNumber.innerHTML = index;
    pageNumber.setAttribute("page-index", index);
    pageNumber.setAttribute("aria-label", "Page " + index);
    paginationNumbers.appendChild(pageNumber);
};
const getPaginationNumbers = () => {
    for (let i = 1; i <= pageCount; i++) {
        appendPageNumber(i);
    }
};

const disableButton = (button) => {
    button.classList.add("is-hidden");
};
const enableButton = (button) => {
    button.classList.remove("is-hidden");
};
const handlePageButtonsStatus = () => {
    if (currentPage === 1) {
        disableButton(prevButton);
    } else {
        enableButton(prevButton);
    }
    if (pageCount === currentPage) {
        disableButton(nextButton);
    } else {
        enableButton(nextButton);
    }
};

const handleActivePageNumber = () => {
    document.querySelectorAll(".pag-1").forEach((button) => {
        button.classList.remove("is-current");

        const pageIndex = Number(button.getAttribute("page-index"));
        if (pageIndex == currentPage) {
            button.classList.add("is-current");
        }
    });
};

const setCurrentPage = (pageNum) => {
    currentPage = pageNum;
    handleActivePageNumber();
    handlePageButtonsStatus();

    const prevRange = (pageNum - 1) * paginationLimit;
    const currRange = pageNum * paginationLimit;
    listItems.forEach((item, index) => {
        item.classList.add("is-hidden");
        if (index >= prevRange && index < currRange) {
            item.classList.remove("is-hidden");
        }
    });
};

window.addEventListener("load", () => {
    getPaginationNumbers();
    setCurrentPage(1);
    prevButton.addEventListener("click", () => {
        setCurrentPage(currentPage - 1);
    });
    nextButton.addEventListener("click", () => {
        setCurrentPage(currentPage + 1);
    });
    document.querySelectorAll(".pag-1").forEach((button) => {
        const pageIndex = Number(button.getAttribute("page-index"));
        if (pageIndex) {
            button.addEventListener("click", () => {
                setCurrentPage(pageIndex);
            });
        }
    });
});