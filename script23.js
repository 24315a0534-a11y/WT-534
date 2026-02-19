const apiURL = "https://jsonplaceholder.typicode.com/posts";

const loadingElement = document.getElementById("loading");
const table = document.getElementById("data-table");
const tableBody = document.querySelector("#data-table tbody");

async function fetchData() {
    try {
        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        displayData(data.slice(0, 10)); 
    } catch (error) {
        loadingElement.textContent = "Error fetching data!";
        console.error("Fetch error:", error);
    }
}


function displayData(data) {
    loadingElement.hidden = true;
    table.hidden = false;

    data.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td>${item.body}</td>
        `;

        tableBody.appendChild(row);
    });
}


document.addEventListener("DOMContentLoaded", fetchData);