-- Drop all existing tables to reset
DROP TABLE IF EXISTS episode_subject, episode_color, subject, color, episode;

-- Main Episode table
CREATE TABLE episode (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    season INTEGER NOT NULL,
    episode_number INTEGER NOT NULL,
    air_date DATE NOT NULL
);

-- Color table
CREATE TABLE color (
    id SERIAL PRIMARY KEY,
    painting_index VARCHAR(255) NOT NULL,
    color_name VARCHAR(255) NOT NULL,
    color_hex VARCHAR(7) NOT NULL,
    UNIQUE KEY (painting_index, color_name)
);

-- Subject table
CREATE TABLE subject (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    UNIQUE KEY (title, subject)
);

-- Junction: Episode <-> Color
CREATE TABLE episode_color (
    episode_id INTEGER REFERENCES episode(id) ON DELETE CASCADE,
    color_id INTEGER REFERENCES color(id) ON DELETE CASCADE,
    PRIMARY KEY (episode_id, color_id)
);

-- Junction: Episode <-> Subject
CREATE TABLE episode_subject (
    episode_id INTEGER REFERENCES episode(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subject(id) ON DELETE CASCADE,
    PRIMARY KEY (episode_id, subject_id)
);

CREATE USER 'generic_user'@'localhost' IDENTIFIED BY 'psswrd';
GRANT ALL PRIVILEGES ON *.* TO 'generic_user'@'localhost';
FLUSH PRIVILEGES;
