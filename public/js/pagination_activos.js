const paginationNumbers2 = document.getElementById("pagination-numbers-2");
const paginatedList2 = document.getElementById("pagination-list-2");
const listItems2 = document.querySelectorAll("[id^='fila']");
const nextButton2 = document.getElementById("next-button-2");
const prevButton2 = document.getElementById("prev-button-2");

const paginationLimit2 = 5;
console.log(listItems2);
const pageCount2 = Math.ceil(listItems2.length / paginationLimit2);
let currentPage2;

const appendPageNumber2 = (index) => {
    const pageNumber2 = document.createElement("a");
    pageNumber2.className = "pagination-link";
    pageNumber2.classList.add('pag-2');
    pageNumber2.innerHTML = index;
    pageNumber2.setAttribute("page-index", index);
    pageNumber2.setAttribute("aria-label", "Page " + index);
    paginationNumbers2.appendChild(pageNumber2);
};
const getPaginationNumbers2 = () => {
    for (let i = 1; i <= pageCount2; i++) {
        appendPageNumber2(i);
    }
};

const disableButton2 = (button) => {
    button.classList.add("is-hidden");
};
const enableButton2 = (button) => {
    button.classList.remove("is-hidden");
};
const handlePageButtonsStatus2 = () => {
    if (currentPage2 === 1) {
        disableButton2(prevButton2);
    } else {
        enableButton2(prevButton2);
    }
    if (pageCount2 === currentPage2) {
        disableButton2(nextButton2);
    } else {
        enableButton2(nextButton2);
    }
};

const handleActivePageNumber2 = () => {
    document.querySelectorAll(".pag-2").forEach((button) => {
        button.classList.remove("is-current");

        const pageIndex2 = Number(button.getAttribute("page-index"));
        if (pageIndex2 == currentPage2) {
            button.classList.add("is-current");
        }
    });
};

const setCurrentPage2 = (pageNum) => {
    currentPage2 = pageNum;
    handleActivePageNumber2();
    handlePageButtonsStatus2();

    const prevRange2 = (pageNum - 1) * paginationLimit2;
    const currRange2 = pageNum * paginationLimit2;
    listItems2.forEach((item, index) => {
        item.classList.add("is-hidden");
        if (index >= prevRange2 && index < currRange2) {
            item.classList.remove("is-hidden");
        }
    });
};

window.addEventListener("load", () => {
    getPaginationNumbers2();
    setCurrentPage2(1);
    prevButton2.addEventListener("click", () => {
        setCurrentPage2(currentPage2 - 1);
    });
    nextButton2.addEventListener("click", () => {
        setCurrentPage2(currentPage2 + 1);
    });
    document.querySelectorAll(".pag-2").forEach((button) => {
        const pageIndex2 = Number(button.getAttribute("page-index"));
        if (pageIndex2) {
            button.addEventListener("click", () => {
                setCurrentPage2(pageIndex2);
            });
        }
    });
});