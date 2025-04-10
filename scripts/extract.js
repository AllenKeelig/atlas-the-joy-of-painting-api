const fs = require('fs/promises');

// Extract colors from the CSV file
async function extractColors() {
    const colors = [];
    const filePath = './data/colors.csv';

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const lines = fileContent.split('\n');

    lines.slice(1).forEach(line => {
        const values = line.split(',');

        colors.push({
            painting_index: values[0],
            painting_title: values[3],
            season: values[4],
            episode_number: values[5],
            colors: values[8],
            color_hex: values[9]
        });
    });

    return colors;
}


// Extract subjects from the CSV file
async function extractSubjects() {
    const subjects = [];
    const filePath = './data/subject.csv';

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    const header = lines[0].split(','); // Subject column names

    lines.slice(1).forEach(line => {
        const values = line.split(',');
        let subjectObj = {
            episode: values[1],
            subjects: []
        };

        header.slice(2).forEach((subject, idx) => {
            if (values[idx + 2] === '1') {
                subjectObj.subjects.push(subject);
            }
        });

        subjects.push(subjectObj);
    });

    return subjects;
}

// Extract dates from the text file
async function extractDates() {
    const dates = [];
    const filePath = './data/dates.txt';

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const lines = fileContent.split('\n');

    lines.forEach(line => {
        const dateInfo = line.match(/"([^"]+)" \(([^)]+)\)/);
        if (dateInfo) {
            dates.push({
                episode: dateInfo[1],
                air_date: new Date(dateInfo[2]) // Convert to Date object
            });
        }
    });

    return dates;
}

module.exports = { extractColors, extractSubjects, extractDates };
