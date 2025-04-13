const stringSimilarity = require('string-similarity');

function normalizeTitle(title) {
    return title
        .toLowerCase()
        .replace(/\bmt\.?\b/g, 'mount')
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function findMatchingDate(paintingTitle, dates) {
    const target = normalizeTitle(paintingTitle);
    const dateTitles = dates.map(d => normalizeTitle(d.episode));
    const match = stringSimilarity.findBestMatch(target, dateTitles);
    const best = match.bestMatch;

    return dates.find(d => normalizeTitle(d.episode) === best.target);
}

function transformData(colors, subjects, dates) {
    const transformed = [];

    colors.forEach(colorData => {
        const subjectData = subjects.find(subj => normalizeTitle(subj.episode) === normalizeTitle(colorData.painting_title));
        const dateData = findMatchingDate(colorData.painting_title, dates);

        transformed.push({
            episode: colorData.painting_title,
            season: colorData.season,
            episode_number: colorData.episode_number,
            colors: colorData.colors,
            air_date: dateData ? dateData.air_date : null,
            subjects: subjectData ? subjectData.subjects : []
        });
    });

    return transformed;
}

module.exports = { transformData };
