const fs = require('fs');
const path = require('path');

const linksPath = path.join(__dirname, 'links.json');
if (!fs.existsSync(linksPath)) {
  console.error('❌ links.json não encontrado!');
  process.exit(1);
}

const links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));
const totalLinks = Object.keys(links).length;
console.log(`📊 ${totalLinks} links encontrados no JSON.`);

const outputDir = path.join(__dirname, 'public');
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

let contador = 0;
for (const [codigo, destino] of Object.entries(links)) {
  // Validação: código com 5 caracteres alfanuméricos (maiúsculos)
  if (!/^[A-Z0-9]{5}$/.test(codigo)) {
    console.warn(`⚠️ Código inválido ignorado: ${codigo}`);
    continue;
  }
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=${destino}">
  <script>window.location.replace("${destino}");</script>
</head>
<body></body>
</html>`;
  fs.writeFileSync(path.join(outputDir, `${codigo}.html`), html);
  contador++;
}

const indexHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Encurtador Super Carioca</title></head>
<body style="font-family: Arial; text-align: center; padding: 50px;">
  <h1>🔗 Encurtador Super Carioca</h1>
  <p>Total de links ativos: <strong>${totalLinks}</strong></p>
</body>
</html>`;
fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);

console.log(`✅ ${contador} páginas de redirecionamento geradas em /public/`);
console.log(`🚀 Site pronto para deploy na Vercel!`);