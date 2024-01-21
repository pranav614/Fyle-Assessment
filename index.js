document.addEventListener("DOMContentLoaded", () => {
  const API = "https://api.github.com/users/";
  const userName = "HuXn-WebDev";
  const twitterUrl = "www.twitter.com/";
  const spinnerContainer = document.querySelector(".loader-container");
  const mainContainer = document.querySelector(".main-container");
  const emptyContainer = document.querySelector(".emptyProjectContainer");
  const paginationContainer = document.querySelector(".pages-container");
  const next = document.querySelector("#nextContainer");

  const handleSpinner = (show) => {
    spinnerContainer.style.display = show ? "block" : "none";
    mainContainer.style.display = show ? "none" : "block";
      next.style.display = "none"; 
  };

  const userData = async () => {
    try {
      handleSpinner(true);
      const fetchedData = await fetch(API + userName);
      if (!fetchedData.ok) {
        throw new Error("Failed to fetch the data for");
      }
      const data = await fetchedData.json();
      const Html = `
    <div class="profileContainer"><div class="sub-profile-container1">
      <div class="profile-img">
        <img src="${data.avatar_url}" alt="">
      <div class="user-link-container">
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="black"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"/></svg>
      <a  href="https://github.com/HuXn-WebDev">Github Link</a>
      </div>
      </div>
       </div>


  <div class="sub-profile-container2">
    <p class="candidate-name">${data.twitter_username}</p>
    <p class="candidate-bio"><strong>${data.bio}</strong></p>
    <div class="candidate-location">
     <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
     <p>${data.location}</p>
    </div>
    <div class="twitterLink">
    <strong>Twitter</strong>: <a href="${
      twitterUrl + data.twitter_username
    }"class="candidate-twitter-link" > ${twitterUrl + data.twitter_username}</a>
    </div>
    </div>
    </div>`;

      const profileBioContainer = document.createElement("div");
      profileBioContainer.innerHTML = Html;
      const profileContainer = document.querySelector(".profile-container");
      profileContainer.append(profileBioContainer);
    } catch (err) {
      console.error(err);
    } finally {
      handleSpinner(false);
    }
  };

  const itemsPerPage = 10;
  let currentPage = 1;
  let totalPages = 0;
  const maxPerPage = 100;
  const totalItemsPerPage = Math.min(itemsPerPage, maxPerPage);

  const userProjectsInfo = async () => {

    try {
      const projectContainer = document.querySelector(".project-container");
      projectContainer.innerHTML = "";
      const fetchedInfo = await fetch(
        `https://api.github.com/users/${userName}/repos`
      );
      if (!fetchedInfo.ok) {
        throw new Error("Failed to fetch the data");
      }
      const dataInfo = await fetchedInfo.json();
      const duplicateArray = dataInfo;
      const searchInput = document.querySelector(".searchInput");
      const filteredArray = duplicateArray.filter((elem) => {
        return elem.name
          .toLowerCase()
          .includes(searchInput.value.trim().toLowerCase());
      });

      if (filteredArray.length === 0) {
        emptyContainer.style.display = "block";
        paginationContainer.style.display = "none";
      } else {
        emptyContainer.style.display = "none";
        paginationContainer.style.display = "block";
      }

      const startIndex = (currentPage - 1) * totalItemsPerPage;
      const endIndex = startIndex + totalItemsPerPage;
      const projectsForCurrentPage = filteredArray.slice(startIndex, endIndex);
      updatePagination(filteredArray);

      projectsForCurrentPage.map((element) => {
        dataHtml = `
        <div class="card-details" key=${element.id}>
        <div class="card-body">
        <h5 class=" projectTitle">${element.name}</h5>
        <p class="project-description">${element.description}</p>
        <div class="languages-container">
        
        </div>
        </div>
        </div>
        </div>
        `;

        const projectContainer = document.querySelector(".project-container");
        const projectSubContainer = document.createElement("div");
        projectSubContainer.innerHTML = dataHtml;
        projectContainer.append(projectSubContainer);

        const languagesContainer = projectSubContainer.querySelector(
          ".languages-container"
        );

        element.topics.forEach((language, index) => {
          const languageDiv = document.createElement("div");
          const languageDiv2 = document.createElement("div");
          languageDiv.innerHTML = `<p class="language-text">${language}</p>`;
          languageDiv2.innerHTML = `<p class="language-text">+${
            element.topics.length - 3
          }</p>`;
          if (index === 3) {
            languagesContainer.append(languageDiv2);
          } else if (index < 3) {
            languagesContainer.append(languageDiv);
          }
        });
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updatePagination = (dataInfo) => {
    let paginationContainer = document.querySelector(".pages-list");
    paginationContainer.innerHTML = "";

    totalPages = Math.ceil(dataInfo.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
      const pageElement = document.createElement("a");
      pageElement.href = "#";
      pageElement.textContent = i;
      pageElement.setAttribute("id", "pageElem");
      pageElement.classList.add("per-page");
      paginationContainer.appendChild(pageElement);
    }
    const arrayOfPages = document.querySelectorAll("#pageElem");
    arrayOfPages.forEach((element) => {
      element.addEventListener("click", () => {
        currentPage = parseInt(element.textContent);
        previous.style.display = "block";
        if (currentPage == totalPages) {
          next.style.display = "none";
        } else {
          next.style.display = "block";
        }
        if (currentPage == 1) {
          previous.style.display = "none";
        } else {
          previous.style.display = "block";
        }

        userProjectsInfo();
      });
    });
  };

  const previous = document.querySelector("#prevContainer");
  previous.addEventListener("click", () => {
    prevPage();
  });
  next.addEventListener("click", () => {
    nextPage();
  });
  const nextPage = () => {
    if (currentPage < totalPages) {
        currentPage = currentPage + 1;
        previous.style.display = "block";
        userProjectsInfo();
    }
    if (currentPage === totalPages) {
        next.style.display = "none";
    }
};
  const prevPage = () => {
    if (currentPage > 1) {
        currentPage = currentPage - 1;
        next.style.display = "block";
        previous.style.display = "block";
        userProjectsInfo();
    }
    if (currentPage === 1) {
        previous.style.display = "none";
    }
};

  const searchBtn = document.querySelector(".searchBtn");
  searchBtn.addEventListener("click", () => {
    userProjectsInfo();
  });

  userData();
  userProjectsInfo();
});
