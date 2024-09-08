let heroes = [];
let currentPage = 1;
let rowsPerPage = 20;
let ascending = true;
let currentData = [];
let currentSortColumn = '';

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

// Helper function to extract numerical values from strings (e.g., "78 kg" -> 78)
const extractNumber = (str) => {
    const num = parseFloat(str.replace(/[^\d.-]/g, ''));
    return isNaN(num) ? null : num;
};

// Function to sort the table by a given key (handles both strings and numerical values, with missing values sorted last)
const sortTable = (key) => {
    // Toggle ascending/descending
    if (currentSortColumn === key) {
        ascending = !ascending;
    } else {
        ascending = true;
    }
    currentSortColumn = key;

    currentData.sort((a, b) => {
        let aValue, bValue;

        if (key === 'height') {
            aValue = extractNumber(a.appearance.height[1]);
            bValue = extractNumber(b.appearance.height[1]);
        } else if (key === 'weight') {
            aValue = extractNumber(a.appearance.weight[1]);
            bValue = extractNumber(b.appearance.weight[1]);
        } else if (key === 'intelligence' || key ==='strength' || key ==='speed' || key === 'durability' || key === 'power' || key === 'combat') {
            aValue = a.powerstats[key] || 0;
            bValue = b.powerstats[key] || 0;
        } else if (key === 'name') {
            aValue = a.name || '';
            bValue = b.name || '';
        } else if (key === 'fullName') {
            aValue = a.biography.fullName || '';
            bValue = b.biography.fullName || '';
        } else if (key === 'race') {
            aValue = a.appearance.race || '';
            bValue = b.appearance.race || '';
        } else if (key === 'gender') {
            aValue = a.appearance.gender || '';
            bValue = b.appearance.gender || '';
        } else if (key === 'alignment') {
            aValue = a.biography.alignment || '';
            bValue = b.biography.alignment || '';
        } else if (key === 'placeOfBirth') {
            aValue = a.biography.placeOfBirth || '';
            bValue = b.biography.placeOfBirth || '';
        } else {
            return 0;
        }

        // Handle missing values
        if (aValue == null || aValue === '') return ascending ? 1 : -1; // Always sort nulls/empty strings last
        if (bValue == null || bValue === '') return ascending ? -1 : 1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        return ascending ? aValue - bValue : bValue - aValue;
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
