

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function POST(request) {
    const data = await request.json();
    const {
        ageFrom = null,
        ageTo = null,
        heightFrom = null,
        heightTo = null,
        weightFrom = null,
        weightTo = null,
        penisLengthFrom = null,
        penisLengthTo = null,
        penisGirthFrom = null,
        penisGirthTo = null,
        latitude = null,
        longitude = null,
        distance = null
    } = data;

    let conditions = [];
    let params = [];

    if (ageFrom !== null) {
        conditions.push(`(birthdate IS NULL OR (YEAR(CURDATE()) - YEAR(birthdate)) >= ?)`);
        params.push(ageFrom);
    }
    if (ageTo !== null) {
        conditions.push(`(birthdate IS NULL OR (YEAR(CURDATE()) - YEAR(birthdate)) <= ?)`);
        params.push(ageTo);
    }
    if (heightFrom !== null && heightTo !== null) {
        conditions.push(`(height IS NULL OR (height > ? AND height < ?))`);
        params.push(heightFrom, heightTo);
    }
    if (weightFrom !== null && weightTo !== null) {
        conditions.push(`(weight IS NULL OR (weight > ? AND weight < ?))`);
        params.push(weightFrom, weightTo);
    }
    if (penisLengthFrom !== null && penisLengthTo !== null) {
        conditions.push(`(penis_length IS NULL OR (penis_length > ? AND penis_length < ?))`);
        params.push(penisLengthFrom, penisLengthTo);
    }
    if (penisGirthFrom !== null && penisGirthTo !== null) {
        conditions.push(`(penis_girth IS NULL OR (penis_girth > ? AND penis_girth < ?))`);
        params.push(penisGirthFrom, penisGirthTo);
    }
    
    // Додаємо умову для відстані
    if (latitude !== null && longitude !== null && distance !== null) {
        conditions.push(`
            (6371000 * ACOS(COS(RADIANS(?)) * COS(RADIANS(latitude)) *
            COS(RADIANS(longitude) - RADIANS(?)) +
            SIN(RADIANS(?)) * SIN(RADIANS(latitude)))) < ?
        `);
        params.push(latitude, longitude, latitude, distance);
    }
    
    const query = `
        SELECT
            id,
            name,
            birthdate,
            height,
            weight,
            penis_length,
            penis_girth,
            latitude,
            longitude,
            last_online_at,
            (6371000 * ACOS(COS(RADIANS(?)) * COS(RADIANS(latitude)) *
            COS(RADIANS(longitude) - RADIANS(?)) +
            SIN(RADIANS(?)) * SIN(RADIANS(latitude)))) AS distance
        FROM
            users
        ${conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : ""}
        ORDER BY
            distance;
    `;

    try {
        const db = await connectToDatabase();
        console.log("SQL Query:", query);
        console.log("SQL Params:", [...params, latitude, longitude, latitude]);

        // Виконуємо запит
        const [result] = await db.execute(query, [...params, latitude, longitude, latitude]);
        console.log("Query Result:", result);
        await db.end();
        return NextResponse.json(result);
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
