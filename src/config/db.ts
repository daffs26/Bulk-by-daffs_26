import { SQLiteDatabase } from 'expo-sqlite';

// Array of incremental SQL migrations.
// The array index represents the transition from version index to version index + 1.
// Version 1 is at migrations[0].
const migrations: string[] = [
  // Version 1: Initial schema setup
  `
    CREATE TABLE IF NOT EXISTS users (
      uid TEXT PRIMARY KEY NOT NULL,
      email TEXT,
      name TEXT,
      gender TEXT,
      age INTEGER,
      height REAL,
      weight_current REAL,
      weight_target REAL,
      activity_level TEXT,
      goal TEXT,
      bmi REAL,
      tdee INTEGER,
      target_calories INTEGER,
      target_protein REAL,
      target_carb REAL,
      target_fat REAL,
      streak INTEGER DEFAULT 0,
      is_onboarded INTEGER DEFAULT 0,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS food_logs (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      calories INTEGER NOT NULL,
      protein REAL DEFAULT 0,
      carbs REAL DEFAULT 0,
      fat REAL DEFAULT 0,
      meal_type TEXT NOT NULL,
      date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS weight_logs (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      weight REAL NOT NULL,
      date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS water_logs (
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      ml INTEGER NOT NULL,
      PRIMARY KEY (user_id, date)
    );
  `,
  // Future updates (Version 2, 3, etc.) will simply be appended as new elements in this array:
  // `ALTER TABLE users ADD COLUMN theme_preference TEXT DEFAULT 'dark';`
];

export async function initializeDatabase(db: SQLiteDatabase) {
  try {
    // Enable Write-Ahead Logging (WAL) for better performance
    await db.execAsync('PRAGMA journal_mode = WAL;');

    // Get current user version from the SQLite header
    const versionRes = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
    const currentVersion = versionRes?.user_version || 0;
    const targetVersion = migrations.length;

    if (currentVersion < targetVersion) {
      console.log(`Database update needed: current version ${currentVersion}, target version ${targetVersion}`);
      
      // Execute all pending migrations in a single safe transaction
      await db.withTransactionAsync(async () => {
        for (let i = currentVersion; i < targetVersion; i++) {
          console.log(`Running migration to database version ${i + 1}...`);
          await db.execAsync(migrations[i]);
        }
        // Update user_version to prevent running migrations again
        await db.execAsync(`PRAGMA user_version = ${targetVersion};`);
      });

      console.log(`Local SQLite Database successfully upgraded to version ${targetVersion}.`);
    } else {
      console.log(`Local SQLite Database is up to date (Version ${currentVersion}).`);
    }
  } catch (error) {
    console.error('Error during local SQLite database initialization/migration:', error);
  }
}

