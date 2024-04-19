const paginationNumbers3 = document.getElementById("pagination-numbers-3");
const paginatedList3 = document.getElementById("pagination-list-3");
const listItems3 = document.querySelectorAll("#pagination-content-3");
const nextButton3 = document.getElementById("next-button-3");
const prevButton3 = document.getElementById("prev-button-3");

const paginationLimit3 = 15;
const pageCount3 = Math.ceil(listItems3.length / paginationLimit3);
let currentPage3;

const appendPageNumber3 = (index) => {
    const pageNumber3 = document.createElement("a");
    pageNumber3.className = "pagination-link";
    pageNumber3.innerHTML = index;
    pageNumber3.setAttribute("page-index", index);
    pageNumber3.setAttribute("aria-label", "Page " + index);
    paginationNumbers3.appendChild(pageNumber3);
};
const getPaginationNumbers3 = () => {
    for (let i = 1; i <= pageCount3; i++) {
        appendPageNumber3(i);
    }
};

const disableButton3 = (button) => {
    button.classList.add("is-hidden");
};
const enableButton3 = (button) => {
    button.classList.remove("is-hidden");
};
const handlePageButtonsStatus3 = () => {
    if (currentPage3 === 1) {
        disableButton2(prevButton3);
    } else {
        enableButton2(prevButton3);
    }
    if (pageCount3 === currentPage3) {
        disableButton2(nextButton3);
    } else {
        enableButton2(nextButton3);
    }
};

const handleActivePageNumber3 = () => {
    document.querySelectorAll(".pagination-link").forEach((button) => {
        button.classList.remove("is-current");

        const pageIndex3 = Number(button.getAttribute("page-index"));
        if (pageIndex3 == currentPage2) {
            button.classList.add("is-current");
        }
    });
};

const setCurrentPage3 = (pageNum) => {
    currentPage3 = pageNum;
    handleActivePageNumber3();
    handlePageButtonsStatus3();

    const prevRange3 = (pageNum - 1) * paginationLimit3;
    const currRange3 = pageNum * paginationLimit3;
    listItems2.forEach((item, index) => {
        item.classList.add("is-hidden");
        if (index >= prevRange3 && index < currRange3) {
            item.classList.remove("is-hidden");
        }
    });
};

window.addEventListener("load", () => {
    getPaginationNumbers3();
    setCurrentPage3(1);
    prevButton3.addEventListener("click", () => {
        setCurrentPage3(currentPage3 - 1);
    });
    nextButton3.addEventListener("click", () => {
        setCurrentPage3(currentPage3 + 1);
    });
    document.querySelectorAll(".pagination-link").forEach((button) => {
        const pageIndex3 = Number(button.getAttribute("page-index"));
        if (pageIndex3) {
            button.addEventListener("click", () => {
                setCurrentPage2(pageIndex3);
            });
        }
    });
});