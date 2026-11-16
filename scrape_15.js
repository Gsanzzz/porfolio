const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECTS = [
  { url: 'https://www.behance.net/gallery/237138581/ION-Periodization', id: '237138581', title: 'ION Periodization' },
  { url: 'https://www.behance.net/gallery/237133841/IBO-Smarters', id: '237133841', title: 'IBO Smarters' },
  { url: 'https://www.behance.net/gallery/237136489/Vision-Marine', id: '237136489', title: 'Vision Marine' },
  { url: 'https://www.behance.net/gallery/237138407/Chatfire', id: '237138407', title: 'Chatfire' },
  { url: 'https://www.behance.net/gallery/237138223/Move', id: '237138223', title: 'Move' },
  { url: 'https://www.behance.net/gallery/237138019/MUV', id: '237138019', title: 'MUV' },
  { url: 'https://www.behance.net/gallery/237136909/FlowFlash', id: '237136909', title: 'FlowFlash' },
  { url: 'https://www.behance.net/gallery/237137693/Clique-Gestor', id: '237137693', title: 'Clique Gestor' },
  { url: 'https://www.behance.net/gallery/237124641/Brasil-eVisa-Tour', id: '237124641', title: 'Brasil eVisa Tour' },
  { url: 'https://www.behance.net/gallery/237134063/SaborAI', id: '237134063', title: 'SaborAI' },
  { url: 'https://www.behance.net/gallery/237137191/Moztrans', id: '237137191', title: 'Moztrans' },
  { url: 'https://www.behance.net/gallery/237136231/Trip-in-Rio', id: '237136231', title: 'Trip in Rio' },
  { url: 'https://www.behance.net/gallery/237135939/Tourtips', id: '237135939', title: 'Tourtips' },
  { url: 'https://www.behance.net/gallery/236572245/Projeto-Vizzion-Play', id: '236572245', title: 'Projeto Vizzion Play' },
  { url: 'https://www.behance.net/gallery/237136661/MyPersonDiet', id: '237136661', title: 'MyPersonDiet' }
];

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const results = [];

for (let i = 0; i < PROJECTS.length; i++) {
  const p = PROJECTS[i];
  console.log(`[${i + 1}/15] Fetching ${p.title} (${p.url})...`);
  const profileDir = `C:\\Users\\Guilherme\\AppData\\Local\\Temp\\chrome_p_${p.id}`;
  const cmd = `cmd /c "\"${chromePath}\" --headless=new --user-data-dir=\"${profileDir}\" --user-agent=\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36\" --dump-dom \"${p.url}\""`;

  try {
    const stdout = execSync(cmd, { maxBuffer: 50 * 1024 * 1024, encoding: 'utf8', timeout: 35000 });
    const match = stdout.match(/<script type="application\/json" id="beconfig-store_state">(.*?)<\/script>/s);

    if (match) {
      const store = JSON.parse(match[1]);
      const proj = store.project?.project || {};

      const title = proj.name || p.title;
      const tags = (proj.tags || []).map(t => t.title).filter(Boolean);
      const category = tags.length > 0 ? tags.slice(0, 2).join(' • ') : 'Design & Development';

      let cover = '';
      if (proj.covers?.allAvailable) {
        const bestCover = proj.covers.allAvailable.find(c => c.url?.includes('max_808') && !c.url?.includes('webp'))
                       || proj.covers.allAvailable.find(c => c.url?.includes('808') && !c.url?.includes('webp'))
                       || proj.covers.allAvailable.find(c => c.url?.includes('404'))
                       || proj.covers.allAvailable[0];
        if (bestCover) cover = bestCover.url;
      }

      const rawImageUrls = [];
      const modules = proj.modules || [];
      for (const m of modules) {
        let imgUrl = '';
        if (m.imageSizes?.allAvailable) {
          const picked = m.imageSizes.allAvailable.find(a => a.url?.includes('max_1200') && !a.url?.includes('webp'))
                      || m.imageSizes.allAvailable.find(a => a.url?.includes('fs') && !a.url?.includes('webp'))
                      || m.imageSizes.allAvailable.find(a => a.url?.includes('hd') && !a.url?.includes('webp'))
                      || m.imageSizes.allAvailable.find(a => a.url?.includes('max_1200_webp'))
                      || m.imageSizes.allAvailable[0];
          if (picked) imgUrl = picked.url;
        }
        if (!imgUrl && m.src) {
          imgUrl = m.src;
        }
        if (imgUrl) rawImageUrls.push(imgUrl);
      }

      console.log(`  -> Found ${rawImageUrls.length} total images`);

      // STRICT USER RULE: Exclude the last image of every project!
      let finalImages = rawImageUrls;
      if (rawImageUrls.length > 1) {
        finalImages = rawImageUrls.slice(0, -1);
        console.log(`  -> Excluded last image: keeping ${finalImages.length} images.`);
      }

      if (!cover && finalImages.length > 0) {
        cover = finalImages[0];
      }

      results.push({
        id: p.id,
        title: title,
        category: category,
        description: proj.description || '',
        cover: cover,
        imageCount: finalImages.length,
        images: finalImages
      });
    } else {
      console.warn(`  -> No store match for ${p.title}`);
    }
  } catch (err) {
    console.error(`  -> Error fetching ${p.title}:`, err.message);
  }

  // Cleanup profile
  try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (e) {}
}

console.log(`Successfully scraped ${results.length}/15 projects!`);
fs.writeFileSync('projects_complete.json', JSON.stringify(results, null, 2), 'utf8');

const jsContent = `// Guilherme Sanz Portfolio - 15 Behance Projects
// Generated directly from live modules, strictly excluding the last image of every project.
const PORTFOLIO_PROJECTS = ${JSON.stringify(results, null, 2)};
`;
fs.writeFileSync('projects_data.js', jsContent, 'utf8');
console.log('Saved to projects_complete.json and projects_data.js');
