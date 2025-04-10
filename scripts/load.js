const { extractColors, extractSubjects, extractDates } = require('./extract');
const { transformData } = require('./transform');
const mysql = require('mysql2/promise');

async function loadData() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'generic_user',
            password: 'psswrd',
            database: 'joy_of_painting'
        });

        const colors = await extractColors();
        const subjects = await extractSubjects();
        const dates = await extractDates();
        const episodes = transformData(colors, subjects, dates);

        console.log('Data loaded from files. Inserting into DB...');

        for (const ep of episodes) {
            await connection.execute(
                'INSERT INTO episode (title, season, episode_number, air_date) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE title=title',
                [ep.episode, ep.season, ep.episode_number, ep.air_date]
            );

            console.log('colors:', ep.colors, 'type:', typeof ep.colors);
            console.log('hexes:', ep.color_hex, 'type:', typeof ep.color_hex);

            for (let i = 0; i < ep.colors.length; i++) {
                if (ep.colors[i] && ep.color_hex[i]) {
                    await connection.execute(
                        'INSERT IGNORE INTO color (painting_index, color_name, color_hex) VALUES (?, ?, ?)',
                        [`${ep.season}-${ep.episode_number}`, ep.colors[i].trim(), ep.color_hex[i].trim()]
                    );
                }
            }

            for (const name of ep.subjects) {
                await connection.execute(
                    'INSERT INTO subject (title, subject) VALUES (?, ?)',
                    [ep.episode, name.trim()]
                );
            }
        }

        console.log('Data successfully inserted into the database.');
        await connection.end();
    } catch (err) {
        console.error('Error loading data:', err);
    }
}

loadData();
