const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ==================================================
// 📝 LISTA OFICIAL DA COLÔNIA TREZE (BASEADA NA IMAGEM)
// ==================================================
const LISTA_DE_RUAS = [
    { rua: "Av. Joaquim Antunes de Almeida (antiga Pista da Granja)", bairro: "Colônia Treze", cep: "49409-114", tipo: "residencial" },
    { rua: "Avenida Principal (Rua do Mercado)", bairro: "Colônia Treze", cep: "49409-188", tipo: "comercial" },
    { rua: "Praça da Bíblia", bairro: "Colônia Treze", cep: "49409-168", tipo: "residencial" },
    { rua: "Praça Santa Luzia", bairro: "Colônia Treze", cep: "49409-190", tipo: "residencial" },
    { rua: "Rodovia Antônio Martins de Menezes (Pista Principal)", bairro: "Colônia Treze", cep: "49409-000", tipo: "rural" },
    { rua: "Rodovia SE 160 (antiga Pista de Boquim)", bairro: "Colônia Treze", cep: "49409-002", tipo: "rural" },
    
    // RUA A
    { rua: "Rua A", bairro: "Colônia Treze (Lot Prq das Laranjeiras)", cep: "49409-008", tipo: "residencial" },
    { rua: "Rua A", bairro: "Colônia Treze (Lot Res Daniel e Maria)", cep: "49409-102", tipo: "residencial" },
    { rua: "Rua A", bairro: "Colônia Treze (Res N Sra de Fátima)", cep: "49409-112", tipo: "residencial" },
    { rua: "Rua A", bairro: "Colônia Treze (Lot Por do Sol)", cep: "49409-138", tipo: "residencial" },
    { rua: "Rua A", bairro: "Colônia Treze (Lot Santa Barbara)", cep: "49409-150", tipo: "residencial" },
    { rua: "Rua A", bairro: "Colônia Treze (CJ Leonor Franco)", cep: "49409-156", tipo: "residencial" },
    { rua: "Rua A", bairro: "Colônia Treze (Jardim Uirapuru)", cep: "49409-176", tipo: "residencial" },
    { rua: "Rua A", bairro: "Colônia Treze (Lot Arco Iris)", cep: "49409-208", tipo: "residencial" },

    // RUAS ESPECÍFICAS
    { rua: "Rua Agilberto Dutra dos Santos", bairro: "Colônia Treze", cep: "49409-144", tipo: "residencial" },
    { rua: "Rua Amintas Monteiro dos Santos", bairro: "Colônia Treze", cep: "49409-056", tipo: "residencial" },
    { rua: "Rua Antônio Acenio dos Santos", bairro: "Colônia Treze", cep: "49409-088", tipo: "residencial" },
    { rua: "Rua Antônio Martins de Menezes", bairro: "Colônia Treze", cep: "49409-184", tipo: "residencial" },
    { rua: "Rua Antônio Otavio de Gois", bairro: "Colônia Treze", cep: "49409-116", tipo: "residencial" },
    { rua: "Rua Arco Íris", bairro: "Colônia Treze", cep: "49409-226", tipo: "residencial" },

    // RUA B
    { rua: "Rua B", bairro: "Colônia Treze (Lot Prq das Laranjeiras)", cep: "49409-010", tipo: "residencial" },
    { rua: "Rua B", bairro: "Colônia Treze (Lot Res Daniel e Maria)", cep: "49409-090", tipo: "residencial" },
    { rua: "Rua B", bairro: "Colônia Treze (Lot Por do Sol)", cep: "49409-136", tipo: "residencial" },
    { rua: "Rua B", bairro: "Colônia Treze (Lot Santa Barbara)", cep: "49409-154", tipo: "residencial" },
    { rua: "Rua B", bairro: "Colônia Treze (CJ Leonor Franco)", cep: "49409-158", tipo: "residencial" },
    { rua: "Rua B", bairro: "Colônia Treze (Jardim Uirapuru)", cep: "49409-178", tipo: "residencial" },
    { rua: "Rua B", bairro: "Colônia Treze (Lot Arco Iris)", cep: "49409-210", tipo: "residencial" },

    // RUA BOLONHA
    { rua: "Rua Bolonha", bairro: "Colônia Treze", cep: "49409-066", tipo: "residencial" },

    // RUA C
    { rua: "Rua C", bairro: "Colônia Treze (Lot Prq das Laranjeiras)", cep: "49409-014", tipo: "residencial" },
    { rua: "Rua C", bairro: "Colônia Treze (Lot Res Daniel e Maria)", cep: "49409-092", tipo: "residencial" },
    { rua: "Rua C", bairro: "Colônia Treze (Lot Novo Horizonte)", cep: "49409-106", tipo: "residencial" },
    { rua: "Rua C", bairro: "Colônia Treze (Lot Por do Sol)", cep: "49409-134", tipo: "residencial" },
    { rua: "Rua C", bairro: "Colônia Treze (Lot Santa Barbara)", cep: "49409-152", tipo: "residencial" },
    { rua: "Rua C", bairro: "Colônia Treze (Jardim Uirapuru)", cep: "49409-182", tipo: "residencial" },
    { rua: "Rua C", bairro: "Colônia Treze (Lot Arco Iris)", cep: "49409-212", tipo: "residencial" },

    // OUTRAS
    { rua: "Rua Chapéu de Palha", bairro: "Colônia Treze", cep: "49409-068", tipo: "residencial" },
    
    // RUA D
    { rua: "Rua D", bairro: "Colônia Treze (Lot Prq das Laranjeiras)", cep: "49409-012", tipo: "residencial" },
    { rua: "Rua D", bairro: "Colônia Treze (Lot Res Daniel e Maria)", cep: "49409-104", tipo: "residencial" },
    { rua: "Rua D", bairro: "Colônia Treze (Lot Arco Iris)", cep: "49409-202", tipo: "residencial" },

    { rua: "Rua de Davi", bairro: "Colônia Treze", cep: "49409-218", tipo: "residencial" },
    { rua: "Rua do Campo", bairro: "Colônia Treze", cep: "49409-034", tipo: "residencial" },

    // RUA E
    { rua: "Rua E", bairro: "Colônia Treze (Lot Prq das Laranjeiras)", cep: "49409-016", tipo: "residencial" },
    { rua: "Rua E", bairro: "Colônia Treze (Lot Res Daniel e Maria)", cep: "49409-094", tipo: "residencial" },
    { rua: "Rua E", bairro: "Colônia Treze (Lot Arco Iris)", cep: "49409-204", tipo: "residencial" },
    { rua: "Rua E", bairro: "Colônia Treze (Lot Novo Horizonte)", cep: "49409-224", tipo: "residencial" },

    { rua: "Rua Eponina Costa", bairro: "Colônia Treze", cep: "49409-026", tipo: "residencial" },

    // RUA F
    { rua: "Rua F", bairro: "Colônia Treze (Lot Res Daniel e Maria)", cep: "49409-096", tipo: "residencial" },
    { rua: "Rua F", bairro: "Colônia Treze (Lot Arco Iris)", cep: "49409-206", tipo: "residencial" },

    { rua: "Rua Flor de Santa Barbara", bairro: "Colônia Treze", cep: "49409-140", tipo: "residencial" },
    { rua: "Rua Florença", bairro: "Colônia Treze", cep: "49409-120", tipo: "residencial" },
    { rua: "Rua Frei Galvão", bairro: "Colônia Treze", cep: "49409-050", tipo: "residencial" }
];
// ==================================================

const dbPath = path.resolve(__dirname, 'ceps.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("❌ Erro no Banco:", err.message);
    else console.log(`✅ Banco conectado em: ${dbPath}`);
});

db.serialize(() => {
    // Cria a tabela
    db.run(`CREATE TABLE IF NOT EXISTS ruas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_rua TEXT,
        bairro TEXT,
        cidade TEXT DEFAULT 'Lagarto',
        uf TEXT DEFAULT 'SE',
        cep TEXT,
        tipo TEXT DEFAULT 'residencial',
        buscas INTEGER DEFAULT 0
    )`);

    // Insere os dados da lista AUTOMATICAMENTE (se o banco estiver vazio)
    db.get("SELECT count(*) as count FROM ruas", (err, row) => {
        if (row.count === 0) {
            console.log(`⚠️ Banco vazio. Inserindo ${LISTA_DE_RUAS.length} ruas da lista...`);
            
            const stmt = db.prepare("INSERT INTO ruas (nome_rua, bairro, cep, tipo) VALUES (?, ?, ?, ?)");
            
            LISTA_DE_RUAS.forEach(item => {
                stmt.run(item.rua, item.bairro, item.cep, item.tipo);
            });
            
            stmt.finalize();
            console.log("✅ Todas as ruas foram cadastradas com sucesso!");
        } else {
            console.log(`ℹ️ O banco já contém ${row.count} ruas cadastradas.`);
        }
    });
});

// Incrementa popularidade
function contarBusca(id) {
    db.run(`UPDATE ruas SET buscas = buscas + 1 WHERE id = ?`, [id]);
}

// --- ROTAS ---

app.get('/api/buscar', (req, res) => {
    const termo = req.query.q;
    const sql = `SELECT * FROM ruas WHERE nome_rua LIKE ? OR cep LIKE ? OR bairro LIKE ? LIMIT 8`;
    db.all(sql, [`%${termo}%`, `%${termo}%`, `%${termo}%`], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ data: rows });
    });
});

app.get('/api/ranking', (req, res) => {
    db.all(`SELECT * FROM ruas ORDER BY buscas DESC LIMIT 10`, [], (err, rows) => {
        if (err) return res.status(400).json({ error: err });
        res.json({ data: rows });
    });
});

app.post('/api/geo-match', (req, res) => {
    const enderecoMap = req.body.endereco;
    if (!enderecoMap) return res.json({ found: false });

    const sql = `SELECT * FROM ruas`; 
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        
        const match = rows.find(rua => {
            const banco = rua.nome_rua.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const mapa = enderecoMap.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return mapa.includes(banco) || banco.includes(mapa);
        });
        
        if (match) {
            contarBusca(match.id);
            res.json({ found: true, data: match });
        } else {
            res.json({ found: false });
        }
    });
});

app.post('/api/contar', (req, res) => {
    const id = req.body.id;
    contarBusca(id);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`🚀 Sistema da Colônia Treze rodando: http://localhost:${PORT}`);
});