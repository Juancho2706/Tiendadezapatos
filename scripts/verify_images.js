const fs = require('fs');
const https = require('https');
const path = require('path');

const seedFile = path.join('d:', 'Proyectos', 'Antigravity', 'Tiendadezapatos', 'supabase', 'seed_products.sql');

try {
    const sqlContent = fs.readFileSync(seedFile, 'utf8');
    // Regex to find URLs in VALUES (..., 'https://...', ...)
    const urlRegex = /'https?:\/\/[^']+'/g;
    const matches = sqlContent.match(urlRegex);

    if (!matches) {
        console.log("No URLs found.");
        process.exit(0);
    }

    const urls = [...new Set(matches.map(s => s.replace(/'/g, '')))]; // Remove quotes and unique

    console.log(`Found ${urls.length} unique URLs. Verifying...`);

    let verified = 0;
    let failed = 0;

    const checkUrl = (url) => {
        return new Promise((resolve) => {
            const req = https.get(url, (res) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    process.stdout.write('.');
                    verified++;
                    resolve(true);
                } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    // Follow redirect manually if needed, or just assume redirect is likely okay for unsplash/etc?
                    // Unsplash often redirects. Let's verify the redirect location recursively or just accept 3xx.
                    // For now, accept 3xx as "Found".
                    process.stdout.write('R');
                    verified++;
                    resolve(true);
                } else {
                    console.log(`\n[FAIL] ${res.statusCode} - ${url}`);
                    failed++;
                    resolve(false);
                }
            }).on('error', (e) => {
                console.log(`\n[ERR] ${e.message} - ${url}`);
                failed++;
                resolve(false);
            });
            req.end();
        });
    };

    (async () => {
        for (const url of urls) {
            await checkUrl(url);
        }
        console.log(`\n\nVerification Complete.`);
        console.log(`Verified: ${verified}`);
        console.log(`Failed: ${failed}`);
    })();

} catch (err) {
    console.error("Error reading file:", err);
}
