import * as SQLite from 'expo-sqlite';

let db;

try {
    db = SQLite.openDatabaseSync('kooragoal.db');
} catch (error) {
    console.error("Error opening database:", error);
}

export const initDatabase = async () => {
    try {
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS favorites_v1 (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        logo TEXT,
        country TEXT,
        team TEXT,
        image TEXT
      );
    `);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

export const getFavorites = async () => {
    try {
        const result = await db.getAllAsync('SELECT * FROM favorites_v1');
        return result;
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }
};

export const addFavorite = async (item, type) => {
    try {
        // Normalize fields based on type
        const logo = item.logo || null;
        const country = item.country || null;
        const team = item.team || null;
        const image = item.image || null;

        await db.runAsync(
            'INSERT OR REPLACE INTO favorites_v1 (id, name, type, logo, country, team, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [item.id, item.name, type, logo, country, team, image]
        );
        console.log('Added favorite:', item.name);
    } catch (error) {
        console.error('Error adding favorite:', error);
    }
};

export const removeFavorite = async (id) => {
    try {
        await db.runAsync('DELETE FROM favorites_v1 WHERE id = ?', [id]);
        console.log('Removed favorite:', id);
    } catch (error) {
        console.error('Error removing favorite:', error);
    }
};
