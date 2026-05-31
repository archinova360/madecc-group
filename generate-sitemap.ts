import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "db_state.json");
const SITEMAP_FILE = path.join(process.cwd(), "public", "sitemap.xml");

console.log("Generating static sitemap.xml from local database state...");

let data: any = { blogs: [], projects: [] };

try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    data = JSON.parse(raw);
  } else {
    console.log("Warning: db_state.json not detected. Using basic default nodes.");
  }
} catch (e) {
  console.error("Could not load db_state.json for sitemap script generator. Proceeding with fallback.", e);
}

const domains = ["madecc-group.online", "madecc-constructionltd.online"];
const staticPaths = ["", "#about", "#services", "#portfolio", "#projects", "#blogs", "#privacy", "#compliance", "#terms"];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

for (const domain of domains) {
  for (const p of staticPaths) {
    xml += `  <url>\n`;
    xml += `    <loc>https://${domain}/${p}</loc>\n`;
    xml += `    <lastmod>2026-05-30</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${p === "" ? "1.0" : "0.8"}</priority>\n`;
    xml += `  </url>\n`;
  }
  
  const publishedBlogs = (data.blogs || []).filter((b: any) => b.published);
  for (const blog of publishedBlogs) {
    xml += `  <url>\n`;
    xml += `    <loc>https://${domain}/#blogs/${blog.slug}</loc>\n`;
    xml += `    <lastmod>${blog.date || "2026-05-30"}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
    
    xml += `  <url>\n`;
    xml += `    <loc>https://${domain}/?page=blogs&amp;slug=${blog.slug}</loc>\n`;
    xml += `    <lastmod>${blog.date || "2026-05-30"}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += `  </url>\n`;
  }
  
  const activeProjects = data.projects || [];
  for (const proj of activeProjects) {
    xml += `  <url>\n`;
    xml += `    <loc>https://${domain}/#projects/${proj.slug}</loc>\n`;
    xml += `    <lastmod>2026-05-30</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
    
    xml += `  <url>\n`;
    xml += `    <loc>https://${domain}/?page=projects&amp;slug=${proj.slug}</loc>\n`;
    xml += `    <lastmod>2026-05-30</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += `  </url>\n`;
  }
}

xml += '</urlset>';

try {
  const dir = path.dirname(SITEMAP_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(SITEMAP_FILE, xml, "utf-8");
  console.log(`Successfully generated dynamic static sitemap file at path: ${SITEMAP_FILE}`);
} catch (err) {
  console.error("Error writing static sitemap.xml file:", err);
}
