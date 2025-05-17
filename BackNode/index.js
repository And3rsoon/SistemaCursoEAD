// index.js
const express = require('express');
const app = express(); // ✅ Primeiro define o app
const mysql = require('mysql2');
const PasswordService = require('./service/senhaEncoder');
const jwt = require('./jwtgeneration');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { gerarPDF } = require('./service/pdfService');
const router = express.Router();
app.use(express.json());
app.use(cors({
  exposedHeaders: ['Authorization']
}));

const http = require('http');
const server = http.createServer(app); // ✅ Cria servidor após definir o app
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } }); // Configura o Socket.io

const port = 3000;

// Conexão para criar banco se não existir
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '11223344'
});

let db;

connection.query("CREATE DATABASE IF NOT EXISTS CursosOnline", (err) => {
  if (err) throw err;
  console.log("Banco 'CursosOnline' criado/verificado.");
  connection.end();

  db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '11223344',
    database: 'CursosOnline'
  });

  db.connect(err => {
    if (err) throw err;
    console.log("Conectado ao banco 'CursosOnline'.");
    const queries = [
        `CREATE TABLE IF NOT EXISTS usuario (
            idUsuario INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(50),
            dataNascimento DATE,
            email VARCHAR(50),
            rua VARCHAR(30),
            bairro VARCHAR(20),
            estado VARCHAR(20),
            role VARCHAR(20),
            status VARCHAR(10),
            telefone VARCHAR(15),
            documento VARCHAR(20),
            cep VARCHAR(10)
        )`,

        `CREATE TABLE IF NOT EXISTS professor (
            idUsuario INT PRIMARY KEY,
            formacao VARCHAR(100),
            FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario)
        )`,

        `CREATE TABLE IF NOT EXISTS aluno (
            idUsuario INT PRIMARY KEY,
            escola VARCHAR(100),
            FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario)
        )`,

        `CREATE TABLE IF NOT EXISTS senha (
            idSenha INT AUTO_INCREMENT PRIMARY KEY,
            idUsuario INT,
            senha VARCHAR(255),
            FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario)
        )`,

        `CREATE TABLE IF NOT EXISTS planos (
            idPlano INT AUTO_INCREMENT PRIMARY KEY,
            tipo VARCHAR(10),
            duracao INT,
            valor FLOAT,
            status VARCHAR(10)
        )`,

        `CREATE TABLE IF NOT EXISTS assinatura (
            idAssinatura INT AUTO_INCREMENT PRIMARY KEY,
            idUsuario INT,
            idPlano INT,
            dataInicio DATE,
            dataTermino DATE,
            status VARCHAR(10),
            FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario),
            FOREIGN KEY (idPlano) REFERENCES planos(idPlano)
        )`,

        `CREATE TABLE IF NOT EXISTS pagamento (
            idPagamento INT AUTO_INCREMENT PRIMARY KEY,
            idAssinatura INT,
            formaPagamento VARCHAR(15),
            status VARCHAR(10),
            FOREIGN KEY (idAssinatura) REFERENCES assinatura(idAssinatura)
        )`,

        `CREATE TABLE IF NOT EXISTS areaCursos (
            idAreaCursos INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(20)
        )`,

        `CREATE TABLE IF NOT EXISTS subAreas (
            idSubAreas INT AUTO_INCREMENT PRIMARY KEY,
            idAreaCursos INT,
            nome VARCHAR(50),
            FOREIGN KEY (idAreaCursos) REFERENCES areaCursos(idAreaCursos)
        )`,

        `CREATE TABLE IF NOT EXISTS cursos (
            idCursos INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(50),
            cargaHoraria INT,
            idSubArea INT,
            idUsuario INT,
            status VARCHAR(10),
            FOREIGN KEY (idSubArea) REFERENCES subAreas(idSubAreas),
            FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario)
        )`,

        `CREATE TABLE IF NOT EXISTS conteudo (
            idConteudo INT AUTO_INCREMENT PRIMARY KEY,
            idCursos INT,
            descricao VARCHAR(100),
            tipo VARCHAR(10),
            urlConteudo VARCHAR(255),
            cargaHoraria INT,
            FOREIGN KEY (idCursos) REFERENCES cursos(idCursos)
        )`,

        `CREATE TABLE IF NOT EXISTS material (
            idMaterial INT AUTO_INCREMENT PRIMARY KEY,
            idCurso INT,
            descricao VARCHAR(100),
            url VARCHAR(255),
            tipo VARCHAR(10),
            FOREIGN KEY (idCurso) REFERENCES cursos(idCursos)
        )`,

        `CREATE TABLE IF NOT EXISTS cursosMatriculado (
            idCursosMatriculado INT AUTO_INCREMENT PRIMARY KEY,
            idUsuario INT,
            idCursos INT,
            status VARCHAR(10),
            porcentagem FLOAT,
            FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario),
            FOREIGN KEY (idCursos) REFERENCES cursos(idCursos)
        )`,

        `CREATE TABLE IF NOT EXISTS atividadeRealizadas (
            idAtividadeRealizadas INT AUTO_INCREMENT PRIMARY KEY,
            idCursosMatriculado INT,
            idConteudo INT,
            data DATE,
            status VARCHAR(10),
            url VARCHAR(255),
            nota FLOAT,
            FOREIGN KEY (idCursosMatriculado) REFERENCES cursosMatriculado(idCursosMatriculado),
            FOREIGN KEY (idConteudo) REFERENCES conteudo(idConteudo)
        )`,

        `CREATE TABLE IF NOT EXISTS caixaMensagem (
            idMensagem INT AUTO_INCREMENT PRIMARY KEY,
            idUsuarioRemetente INT,
            idUsuarioDestinatario INT,
            idCurso INT,
            mensagem TEXT,
            FOREIGN KEY (idUsuarioRemetente) REFERENCES usuario(idUsuario),
            FOREIGN KEY (idUsuarioDestinatario) REFERENCES usuario(idUsuario),
            FOREIGN KEY (idCurso) REFERENCES cursos(idCursos)
        )`,
       ` CREATE TABLE IF NOT EXISTS mensagem (
            idMensagem INT AUTO_INCREMENT PRIMARY KEY,
            idUsuario INT NOT NULL,
            idCurso INT NOT NULL,
            destinatario ENUM('aluno', 'professor', 'administrador', 'ambos') NOT NULL,
            data DATETIME DEFAULT CURRENT_TIMESTAMP,
            status ENUM('lida', 'pendente') DEFAULT 'pendente',
            mensagem TEXT NOT NULL,
            FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario),
            FOREIGN KEY (idCurso) REFERENCES cursos(idCursos))`
    ];

    Promise.all(
          queries.map(q => 
            new Promise((resolve, reject) => {
              db.query(q, err => {
                if (err) {
                  console.error('Erro ao criar tabela:', err.message);
                  reject(err);
                } else {
                  resolve();
                }
              });
            })
          )
        )
        .then(() => {
          console.log('Todas as tabelas foram criadas/verificadas.');
          startServer(); //Agora o servidor será iniciado
          
        })
        .catch(err => {
          console.error('Erro ao criar tabelas:', err);
        });
  });
});

function startServer() {
  io.on('connection', (socket) => {
    console.log('Usuário conectado');

    socket.on('joinCurso', ({ idUsuario, idCurso }) => {
      socket.join(`curso_${idCurso}`);
      console.log(`Usuário ${idUsuario} entrou na sala do curso ${idCurso}`);
    });

    socket.on('mensagem', ({ idUsuarioRemetente, idCurso, mensagem }) => {
      const consultaUsuarios = `
        SELECT idUsuario FROM cursosMatriculado
        WHERE idCursos = ? AND idUsuario != ?
      `;

      db.query(consultaUsuarios, [idCurso, idUsuarioRemetente], (err, resultados) => {
        if (err) {
          console.error('Erro ao buscar alunos:', err);
          return;
        }

        resultados.forEach(({ idUsuario }) => {
          const inserirMensagem = `
            INSERT INTO caixaMensagem (idUsuarioRemetente, idUsuarioDestinatario, idCurso, mensagem)
            VALUES (?, ?, ?, ?)
          `;

          db.query(inserirMensagem, [idUsuarioRemetente, idUsuario, idCurso, mensagem], (err) => {
            if (err) console.error('Erro ao salvar mensagem:', err);
          });

          io.to(`curso_${idCurso}`).emit('novaMensagem', {
            idUsuarioRemetente,
            idUsuarioDestinatario: idUsuario,
            idCurso,
            mensagem,
            data: new Date()
          });
        });
      });
    });

    socket.on('disconnect', () => {
      console.log('Usuário desconectado');
    });
  });

  server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  }).on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Porta ${port} já está em uso. Feche o processo que está usando essa porta.`);
    } else {
      console.error(err);
    }
});



app.post('/mensagens', (req, res) => {
  const { idUsuario, role } = req.body;

  let query = '';
  let params = [];

  if (role === 'aluno') {
    query = `
      SELECT * FROM mensagem
      WHERE destinatario IN ('aluno', 'ambos') AND idCurso IN (
        SELECT idCursos FROM cursosMatriculado WHERE idUsuario = ?
      )
    `;
    params = [idUsuario];
  } else if (role === 'professor') {
    query = `
      SELECT * FROM mensagem
      WHERE destinatario IN ('professor', 'ambos') AND idCurso IN (
        SELECT idCursos FROM cursos WHERE idUsuario = ?
      )
    `;
    params = [idUsuario];
  } else if (role === 'administrador') {
    query = `SELECT * FROM mensagem`;
  } else {
    return res.status(400).json({ error: 'Role inválida' });
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Erro ao buscar mensagens:', err);
      res.status(500).json({ error: 'Erro ao buscar mensagens' });
    } else {
      res.json(results);
    }
  });
});


app.post('/mensagem', (req, res) => {
  const { idUsuario, idCurso, destinatario, mensagem, status } = req.body;

  const query = `
    INSERT INTO mensagem (idUsuario, idCurso, destinatario, mensagem, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [idUsuario, idCurso, destinatario, mensagem, status || 'pendente'], (err, result) => {
    if (err) {
      console.error('Erro ao gravar mensagem:', err);
      return res.status(500).json({ error: 'Erro ao gravar mensagem' });
    }
    res.status(201).json({ success: true, idMensagem: result.insertId });
  });
});

app.get('/cursos-professor/:idUsuario', (req, res) => {
  const { idUsuario } = req.params;

  const query = `SELECT * FROM cursos idUsuario = ? AND status = 'ativo'`;

  db.query(query, [idUsuario], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar cursos' });
    res.json(results);
  });
});

app.get('/cursos-ativos', (req, res) => {
  const query = `SELECT * FROM cursos WHERE status = 'ativo'`;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar cursos ativos' });
    res.json(results);
  });
});


app.put('/api/atualizar-porcentagem/:idCursosMatriculado', (req, res) => {
  const { idCursosMatriculado } = req.params;

  const totalQuery = `
    SELECT COUNT(*) AS total FROM atividadeRealizadas
    WHERE idCursosMatriculado = ?
  `;

  const concluidoQuery = `
    SELECT COUNT(*) AS concluidas FROM atividadeRealizadas
    WHERE idCursosMatriculado = ? AND status = 'concluida'
  `;

  db.query(totalQuery, [idCursosMatriculado], (err, totalResult) => {
    if (err) return res.status(500).json({ error: 'Erro ao contar atividades totais' });

    db.query(concluidoQuery, [idCursosMatriculado], (err, concluidoResult) => {
      if (err) return res.status(500).json({ error: 'Erro ao contar atividades concluídas' });

      const total = totalResult[0].total || 0;
      const concluidas = concluidoResult[0].concluidas || 0;
      const porcentagem = total > 0 ? (concluidas / total) * 100 : 0;

      const updateQuery = `
        UPDATE cursosMatriculado SET porcentagem = ? WHERE idCursosMatriculado = ?
      `;

      db.query(updateQuery, [porcentagem, idCursosMatriculado], (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar porcentagem' });

        res.status(200).json({ porcentagem });
      });
    });
  });
});


app.put('/atividades-realizadas/:id', (req, res) => {
  const { id } = req.params;
  const dataAtual = new Date();
  const status = 'concluida';

  const query = `
    UPDATE atividadeRealizadas
    SET status = ?, data = ?
    WHERE idAtividadeRealizadas = ?
  `;

  db.query(query, [status, dataAtual, id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar atividade realizada:', err);
      return res.status(500).json({ error: 'Erro ao atualizar atividade.' });
    }

    return res.status(200).json({ message: 'Atividade finalizada com sucesso.' });
  });
});


app.get('/atividades/:idCursosMatriculado', async (req, res) => {
  const { idCursosMatriculado } = req.params;

  const query = `
    SELECT 
      ar.idAtividadeRealizadas AS id,
      ar.status,
      ar.nota,
      ar.data,
      ar.url,
      c.idConteudo,
      c.descricao,
      c.tipo,
      c.urlConteudo,
      c.cargaHoraria
    FROM atividadeRealizadas ar
    JOIN conteudo c ON ar.idConteudo = c.idConteudo
    WHERE ar.idCursosMatriculado = ?
  `;

  try {
    const [rows] = await db.promise().query(query, [idCursosMatriculado]);

    const atividades = rows.map(row => ({
      id: row.id,
      status: row.status,
      nota: row.nota,
      data: row.data,
      url: row.url,
      conteudo: {
        idConteudo: row.idConteudo,
        descricao: row.descricao,
        tipo: row.tipo,
        urlConteudo: row.urlConteudo,
        cargaHoraria: row.cargaHoraria
      }
    }));

    res.json(atividades);
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    res.status(500).json({ message: 'Erro ao buscar atividades.' });
  }
});


// Exemplo usando Express.js
app.get('/api/cursos-matriculados/:idUsuario', (req, res) => {
  const { idUsuario } = req.params;

  const query = `
    SELECT 
      cm.idCursosMatriculado,
      cm.porcentagem,
      c.nome AS nomeCurso,
      c.cargaHoraria,
      a.nome AS nomeArea,
      sa.nome AS nomeSubArea
    FROM cursosMatriculado cm
    JOIN cursos c ON cm.idCursos = c.idCursos
    JOIN subAreas sa ON c.idSubArea = sa.idSubAreas
    JOIN areaCursos a ON sa.idAreaCursos = a.idAreaCursos
    WHERE cm.idUsuario = ?
  `;

  db.query(query, [idUsuario], (err, results) => {
    if (err) {
      console.error('Erro ao buscar cursos matriculados:', err);
      return res.status(500).json({ error: 'Erro ao buscar cursos.' });
    }

    return res.status(200).json(results);
  });
});

app.get('/api/cursos-completo', (req, res) => {
  const query = `
    SELECT 
      c.idCursos, c.nome, c.cargaHoraria,
      a.nome AS area,
      s.nome AS subarea
    FROM cursos c
    JOIN subAreas s ON c.idSubArea = s.idSubAreas
    JOIN areaCursos a ON s.idAreaCursos = a.idAreaCursos
    WHERE c.status = 'ativo'
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar cursos:', err);
      return res.status(500).json({ error: 'Erro ao buscar cursos.' });
    }

    res.status(200).json(results);
  });
});

app.get('/cursoMatriculado/:id', (req, res) => {
  const id = req.params.id; // <<< Aqui você extrai o parâmetro da rota

  const query = `
    SELECT * 
    FROM cursosMatriculado c
    WHERE c.idCursosMatriculado = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar cursos:', err);
      return res.status(500).json({ error: 'Erro ao buscar cursos.' });
    }
    res.status(200).json(results);
  });
});


app.post('/api/matricular-curso', (req, res) => {
  const { idUsuario, idCursos, status, porcentagem } = req.body;

  // Inserir na tabela cursosMatriculado
  const insertMatriculaQuery = `
    INSERT INTO cursosMatriculado (idUsuario, idCursos, status, porcentagem)
    VALUES (?, ?, ?, ?)
  `;

  db.query(insertMatriculaQuery, [idUsuario, idCursos, status, porcentagem], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar matrícula:', err);
      return res.status(500).json({ error: 'Erro ao cadastrar matrícula.' });
    }

    const idCursosMatriculado = result.insertId;

    // Buscar todos os conteúdos do curso
    const selectConteudosQuery = `
      SELECT idConteudo FROM conteudo WHERE idCursos = ?
    `;

    db.query(selectConteudosQuery, [idCursos], (err, conteudos) => {
      if (err) {
        console.error('Erro ao buscar conteúdos:', err);
        return res.status(500).json({ error: 'Erro ao buscar conteúdos do curso.' });
      }

      if (conteudos.length === 0) {
        return res.status(201).json({ message: 'Matrícula realizada. Nenhum conteúdo para registrar.' });
      }

      // Preparar inserções para atividadeRealizadas
      const insertAtividadesQuery = `
        INSERT INTO atividadeRealizadas (idCursosMatriculado, idConteudo, data, status, url, nota)
        VALUES ?
      `;

      const dataAtual = new Date().toISOString().split('T')[0]; // formato YYYY-MM-DD

      const atividadesData = conteudos.map(conteudo => [
        idCursosMatriculado,
        conteudo.idConteudo,
        dataAtual,
        'pendente',
        'vazio',
        0
      ]);

      db.query(insertAtividadesQuery, [atividadesData], (err) => {
        if (err) {
          console.error('Erro ao registrar atividades realizadas:', err);
          return res.status(500).json({ error: 'Erro ao registrar atividades realizadas.' });
        }

        res.status(201).json({ message: 'Matrícula e atividades registradas com sucesso!' });
      });
    });
  });
});


app.get('/api/cursos-ativos', (req, res) => {
  const query = 'SELECT idCursos, nome FROM cursos WHERE status = "ativo"';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar cursos ativos:', err);
      return res.status(500).json({ error: 'Erro ao buscar cursos.' });
    }

    res.status(200).json(results);
  });
});

app.post('/api/conteudos', (req, res) => {
  const { idCursos, descricao, tipo, urlConteudo, cargaHoraria } = req.body;

  const query = `
    INSERT INTO conteudo (idCursos, descricao, tipo, urlConteudo, cargaHoraria)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [idCursos, descricao, tipo, urlConteudo, cargaHoraria], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar conteúdo:', err);
      return res.status(500).json({ error: 'Erro ao cadastrar conteúdo.' });
    }

    res.status(201).json({ message: 'Conteúdo cadastrado com sucesso!' });
  });
});


app.get('/api/subareas/por-area/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT idSubAreas, nome FROM subAreas WHERE idAreaCursos = ?';

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar subáreas' });
    res.status(200).json(results);
  });
});

app.post('/api/cursos', (req, res) => {
  const { nome, cargaHoraria, idSubArea, idUsuario, status } = req.body;
  const query = `
    INSERT INTO cursos (nome, cargaHoraria, idSubArea, idUsuario, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [nome, cargaHoraria, idSubArea, idUsuario, status], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao cadastrar curso' });
    res.status(201).json({ message: 'Curso cadastrado com sucesso' });
  });
});

app.get('/api/professores', (req, res) => {
  const query = 'SELECT idUsuario, nome FROM usuario WHERE role = "professor"';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar professores:', err);
      return res.status(500).json({ error: 'Erro ao buscar professores.' });
    }

    res.status(200).json(results);
  });
});
// Adiciona uma nova área
app.post('/api/adicionar-area', (req, res) => {
  const { nome } = req.body;
  
  if (!nome) {
    return res.status(400).json({ error: 'Nome da área é obrigatório.' });
  }

  const query = 'INSERT INTO areaCursos (nome) VALUES (?)';

  db.query(query, [nome], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar área:', err);
      return res.status(500).json({ error: 'Erro ao adicionar área.' });
    }

    res.status(201).json({ message: 'Área cadastrada com sucesso!', idAreaCursos: result.insertId });
  });
});

app.get('/api/areas', (req, res) => {
  db.query('SELECT idAreaCursos, nome FROM areaCursos', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar áreas' });
    res.status(200).json(results);
  });
});

app.post('/api/subareas', (req, res) => {
  const { idAreaCursos, nome } = req.body;
  const query = 'INSERT INTO subAreas (idAreaCursos, nome) VALUES (?, ?)';

  db.query(query, [idAreaCursos, nome], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao cadastrar subárea' });
    res.status(201).json({ message: 'Subárea cadastrada com sucesso' });
  });
});

// Endpoint para cadastrar plano
app.post('/cadastrar-plano', (req, res) => {
    const { tipo, duracao, valor } = req.body;
    const status = 'ativo'; // ou use outro valor conforme regra de negócio

    const sql = 'INSERT INTO planos (tipo, duracao, valor, status) VALUES (?, ?, ?, ?)';
    db.query(sql, [tipo, duracao, valor, status], (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar plano:', err.message);
            return res.status(500).json({ error: 'Erro ao cadastrar plano' });
        }
        res.status(201).json({ message: 'Plano cadastrado com sucesso!', idPlano: result.insertId });
    });
});



app.post('/api/verificar-usuario', (req, res) => {
  const { cpf, email } = req.body;

  const query = `SELECT * FROM usuario WHERE documento = ? OR email = ?`;
  db.query(query, [cpf, email], (err, results) => {
    if (err) {
      console.error('Erro ao verificar usuário:', err);
      return res.status(500).json({ error: 'Erro ao verificar usuário.' });
    }

    if (results.length > 0) {
      return res.status(200).json({ existente: true });
    } else {
      return res.status(200).json({ existente: false });
    }
  });
});




app.get('/api/buscar-planos', (req, res) => {
  const query = 'SELECT * FROM planos WHERE status = "ativo"';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar planos:', err);
      return res.status(500).json({ error: 'Erro ao buscar planos.' });
    }

    const planos = {};
    results.forEach(row => {
      planos[row.tipo] = {
        idPlano: row.idPlano,
        valor: row.valor,
        duracao: row.duracao
      };
    });

    return res.status(200).json(planos);
  });
});

app.delete('/planos/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'UPDATE planos SET status = "inativo" WHERE idPlano = ?';

  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Erro ao excluir plano:', err.message);
      return res.status(500).json({ error: 'Erro ao excluir plano' });
    }
    res.json({ message: 'Plano excluído com sucesso!' });
  });
});

app.put('/planos/:id', (req, res) => {
  const { id } = req.params;
  const { tipo, duracao, valor } = req.body;

  const sql = 'UPDATE planos SET tipo = ?, duracao = ?, valor = ? WHERE idPlano = ?';

  db.query(sql, [tipo, duracao, valor, id], (err) => {
    if (err) {
      console.error('Erro ao atualizar plano:', err.message);
      return res.status(500).json({ error: 'Erro ao atualizar plano' });
    }
    res.json({ message: 'Plano atualizado com sucesso!' });
  });
});




app.post('/cadastrar-cliente', async (req, res) => {
    const cliente = req.body;

    try {
        // 1. Inserir na tabela usuario
        const usuarioSql = `
            INSERT INTO usuario (nome, dataNascimento, email, rua, bairro, estado, role, status, telefone, documento, cep)
            VALUES (?, ?, ?, ?, ?, ?, 'aluno', 'ativo', ?, ?, ?)
        `;
        const usuarioParams = [
            cliente.nome,
            cliente.dataNascimento,
            cliente.email,
            cliente.rua,
            cliente.bairro,
            cliente.estado,
            cliente.telefone,
            cliente.cpf,
            cliente.cep
        ];

        const [usuarioResult] = await db.promise().query(usuarioSql, usuarioParams);
        const idUsuario = usuarioResult.insertId;

        // 2. Criptografar a senha
        const senhaCriptografada = await PasswordService.encryptPassword(cliente.senha);

        // 3. Inserir na tabela senha
        const senhaSql = `INSERT INTO senha (idUsuario, senha) VALUES (?, ?)`;
        await db.promise().query(senhaSql, [idUsuario, senhaCriptografada]);

        // 4. Buscar plano
        const planoSql = `SELECT idPlano, duracao FROM planos WHERE tipo = ? AND status = 'ativo'`;
        const [planos] = await db.promise().query(planoSql, [cliente.plano]);

        if (planos.length === 0) {
            return res.status(400).json({ message: 'Plano não encontrado ou inativo.' });
        }

        const { idPlano, duracao } = planos[0];

        // 5. Inserir na tabela assinatura
        const dataInicio = new Date();
        const dataTermino = new Date(dataInicio);
        dataTermino.setDate(dataInicio.getDate() + duracao);

        const assinaturaSql = `
            INSERT INTO assinatura (idUsuario, idPlano, dataInicio, dataTermino, status)
            VALUES (?, ?, ?, ?, 'ativa')
        `;
        await db.promise().query(assinaturaSql, [idUsuario, idPlano, dataInicio, dataTermino]);

        res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });

    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});


app.post('/cadastrar-funcionario', async (req, res) => {
    const funcionario = req.body;

    try {
        // 1. Inserir na tabela usuario com role de funcionário (ex: professor ou coordenador)
        const usuarioSql = `
            INSERT INTO usuario (nome, dataNascimento, email, rua, bairro, estado, role, status, telefone, documento, cep)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'ativo', ?, ?, ?)
        `;
        const usuarioParams = [
            funcionario.nome,
            funcionario.dataNascimento,
            funcionario.email,
            funcionario.rua || '',
            funcionario.bairro || '',
            funcionario.estado || '',
            funcionario.role, // ex: 'professor' ou 'coordenador'
            funcionario.telefone || '',
            funcionario.cpf,
            funcionario.cep || ''
        ];

        const [usuarioResult] = await db.promise().query(usuarioSql, usuarioParams);
        const idUsuario = usuarioResult.insertId;

        // 2. Criptografar a senha
        const senhaCriptografada = await PasswordService.encryptPassword(funcionario.senha);

        // 3. Inserir na tabela senha
        const senhaSql = `INSERT INTO senha (idUsuario, senha) VALUES (?, ?)`;
        await db.promise().query(senhaSql, [idUsuario, senhaCriptografada]);

        res.status(201).json({ message: 'Funcionário cadastrado com sucesso!' });

    } catch (error) {
        console.error('Erro ao cadastrar funcionário:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});



app.post('/api/usuario/login', async (req, res) => {
  const { user, password } = req.body; // user = CPF

  if (!user || !password) {
    return res.status(400).json({ error: 'CPF e senha são obrigatórios' });
  }

  // Buscar usuário pelo CPF
  db.query('SELECT * FROM usuario WHERE documento = ?', [user], (err, userResults) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ error: 'Erro no servidor ao buscar usuário' });
    }

    if (userResults.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const usuario = userResults[0];

    // Buscar a senha vinculada ao usuário
    db.query('SELECT * FROM senha WHERE idUsuario = ?', [usuario.idUsuario], async (err, senhaResults) => {
      if (err) {
        console.error('Erro ao buscar senha:', err);
        return res.status(500).json({ error: 'Erro no servidor ao buscar senha' });
      }

      if (senhaResults.length === 0) {
        return res.status(401).json({ error: 'Senha não cadastrada para este usuário' });
      }

      const senhaHash = senhaResults[0].senha;
      const senhaValida = await PasswordService.comparePassword(password, senhaHash);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Senha incorreta' });
      }

      // Criar token JWT com payload necessário
      const token = jwt.criarJwt(usuario.idUsuario, usuario.role);

      // Retornar dados e token
      res.header('Authorization', `Bearer ${token}`)
         .status(200)
         .json({
           message: 'Login realizado com sucesso',
           id: usuario.idUsuario,
           nome: usuario.nome,
           role: usuario.role
         });
    });
  });
});


app.get('/user/autenticar', (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = tokenHeader.split(' ')[1];
    const resultado = jwt.verificar(token);

    if (resultado === "ok") {
      return res.status(200).json({ valor: "ok" });
    } else {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
  } catch (err) {
    return res.status(401).json({ error: 'Erro ao processar token' });
  }
});


//----------------------------------------------------------------------------------

}