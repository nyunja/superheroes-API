let heroes = [];
let currentPage = 1;
let rowsPerPage = 20;
let ascending = true;
let currentData = [];
let lastSortedColumn = '';

// Load the data and initialize the table
const loadData = (data) => {
    heroes = data;
    currentData = [...heroes];  // Initialize currentData with all the heroes
    ascending = true;  // Set sorting direction to ascending for the first load
    currentData.sort((a, b) => a.name.localeCompare(b.name));  // Sort by name in ascending order
    renderTable(currentData);  // Render the sorted table
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
            <td><img src="${hero.images.xs}" alt="${hero.name}"/></td>
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

    updatePaginationControls(data.length);
};

// Function to sort the table by a given key
const sortTable = (key) => {
    if (key === lastSortedColumn) {
        // If the same column is clicked again, toggle the sorting order
        ascending = !ascending;
    } else {
        // If a new column is clicked, default to ascending order
        ascending = true;
    }

    lastSortedColumn = key;  // Update the last sorted column

    currentData.sort((a, b) => {
        const aValue = getSortableValue(a, key);
        const bValue = getSortableValue(b, key);

        // Sort missing values ('N/A') last
        if (aValue === 'N/A') return 1;
        if (bValue === 'N/A') return -1;
        if (aValue === 'N/A' && bValue === 'N/A') return 0;

        // Handle string comparison for non-numerical data
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        // Handle numerical sorting
        return ascending ? aValue - bValue : bValue - aValue;
    });

    renderTable(currentData);  // Render the sorted data
};

// Function to get the sortable value for a given key
const getSortableValue = (hero, key) => {
    let value = hero[key];

    // Handle nested properties like 'powerstats.intelligence'
    if (key.includes('.')) {
        const keys = key.split('.');
        value = keys.reduce((acc, k) => (acc ? acc[k] : 'N/A'), hero);
    }

    // Handle weight/height columns where values are like "78 kg" or "6 ft"
    if (typeof value === 'string' && value.match(/\d+/)) {
        return parseInt(value.match(/\d+/)[0], 10);  // Extract the number
    }

    return value || 'N/A';  // Ensure missing values are 'N/A'
};

// Search functionality
const searchTable = () => {
    const input = document.getElementById('search').value.toLowerCase();
    currentData = heroes.filter(hero => hero.name.toLowerCase().includes(input));
    currentPage = 1;  // Reset to first page after search
    renderTable(currentData);
};

// Update rows per page
const updateRows = () => {
    rowsPerPage = document.getElementById('rows').value === 'all' ? 'all' : parseInt(document.getElementById('rows').value);
    currentPage = 1;  // Reset to first page after changing rows per page
    renderTable(currentData);
};

// Change page function
const changePage = (direction) => {
    if (direction === 'prev') {
        if (currentPage > 1) {
            currentPage--;
        }
    } else if (direction === 'next') {
        const totalPages = rowsPerPage === 'all' ? 1 : Math.ceil(currentData.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
        }
    }
    renderTable(currentData);
};

// Update pagination controls
const updatePaginationControls = (totalItems) => {
    const totalPages = rowsPerPage === 'all' ? 1 : Math.ceil(totalItems / rowsPerPage);
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
};

// Fetch the data and load the table on page load
fetchData();
