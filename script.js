let heroes = [];
let currentPage = 1;
let rowsPerPage = 20;
let ascending = true;
let currentData = [];

// Load the data and initialize the table
const loadData = (data) => {
    heroes = data;
    currentData = [...heroes];  // Initialize currentData with all the heroes
    sortTable('name');  // Sort by name initially
};

// Fetch data from the API
const fetchData = () => {
    fetch('https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json')
        .then(response => response.json())
        .then(loadData);
};

// Function to render the table
const renderTable = (data) => {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';  // Clear current table data
    let slicedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    if (rowsPerPage === 'all') {
        slicedData = data;
    }

    slicedData.forEach(hero => {
        let row = `<tr>
            <td><img src="${hero.images.xs}" alt="${hero.name}/"></td>
            <td>${hero.name}</td>
            <td>${hero.biography.fullName || 'N/A'}</td>
            <td>${hero.powerstats.intelligence || 'N/A'}</td>
            <td>${hero.powerstats.strength || 'N/A'}</td>
            <td>${hero.powerstats.speed || 'N/A'}</td>
            <td>${hero.powerstats.durability || 'N/A'}</td>
            <td>${hero.powerstats.power || 'N/A'}</td>
            <td>${hero.powerstats.combat || 'N/A'}</td>
            <td>${hero.appearance.race || 'N/A'}</td>
            <td>${hero.appearance.gender || 'N/A'}</td>
            <td>${hero.appearance.height[1] || 'N/A'}</td>
            <td>${hero.appearance.weight[1] || 'N/A'}</td>
            <td>${hero.biography.placeOfBirth || 'N/A'}</td>
            <td>${hero.biography.alignment || 'N/A'}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
    updatePagination();
};

// Function to sort the table by a given key
const sortTable = (key) => {
    ascending = !ascending;

    currentData.sort((a, b) => {
        const aValue = a[key] || '';
        const bValue = b[key] || '';

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return ascending ? aValue - bValue : bValue - aValue;
    });

    renderTable(currentData);
};

const sortPowerstats = (key) => {
    ascending = !ascending;
    currentData.sort((a, b) => {
        const aValue = a.powerstats[key] || 0;
        const bValue = b.powerstats[key] || 0;
        return ascending ? aValue - bValue : bValue - aValue;
    });
    renderTable(currentData);
};

const sortByHW = (key) => {
    ascending = !ascending;
    currentData.sort((a, b) => {
        const aHeight = parseInt(a.appearance[key][1].split(' ')[0]) || 0;
        const bHeight = parseInt(b.appearance[key][1].split(' ')[0]) || 0;
        return ascending ? aHeight - bHeight : bHeight - aHeight;
    });
    renderTable(currentData);
};

// Filter functionality

// Pagination
const updatePagination = () => {
    const totalPages = calculateTotalPages();
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';
    // Page info
    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    paginationContainer.appendChild(pageInfo);

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.onclick = () => changePage(currentPage - 1);
    prevButton.disabled = currentPage === 1;
    paginationContainer.appendChild(prevButton);

    // Page numbers
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => changePage(i);
        pageButton.classList.toggle('active', i === currentPage);
        paginationContainer.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.onclick = () => changePage(currentPage + 1);
    nextButton.disabled = currentPage === totalPages;
    paginationContainer.appendChild(nextButton);
};

const changePage = (newPage) => {
    const totalPages = calculateTotalPages();
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderTable(currentData);
        updatePagination();
    }
};

const calculateTotalPages = () => {
    if (rowsPerPage === 'all') {
        return 1;
    }
    return Math.ceil(currentData.length / rowsPerPage);
};

// Search functionality
const searchTable = () => {
    const input = document.getElementById('search').value.toLowerCase();
    currentData = heroes.filter(hero => hero.name.toLowerCase().includes(input));
    renderTable(currentData);
};

// Update rows per page
const updateRows = () => {
    rowsPerPage = document.getElementById('rows').value === 'all' ? 'all' : parseInt(document.getElementById('rows').value);
    renderTable(currentData);
};

// Fetch the data and load the table on page load
fetchData();
