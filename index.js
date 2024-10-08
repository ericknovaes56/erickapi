const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Importa o pacote cors

const app = express();
const port = 3001;

const allowedOrigins = [
    'http://localhost:3000',
    'https://ericknovaes56.netlify.app/', 
    'https://ericknovaes56.netlify.app', 
  ];
  
  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        // Permite a origem se estiver na lista ou se a origem não estiver definida (por exemplo, quando a origem é undefined)
        callback(null, true);
      } else {
        // Rejeita a origem se não estiver na lista
        callback(new Error('Não autorizado por CORS'));
      }
    },
  };
  
  app.use(cors(corsOptions)); // Adiciona o middleware cors com opções
app.use(express.json()); // Para lidar com o corpo das requisições JSON

const filePath = path.join(__dirname, 'clicks.json');

// Rota para obter a quantidade total de cliques
app.get('/clicks', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao ler o arquivo' });
    }

    try {
      const jsonData = JSON.parse(data);
      res.json({ clicks: jsonData.click });
    } catch (parseErr) {
      res.status(500).json({ error: 'Erro ao processar os dados' });
    }
  });
});

// Rota para incrementar o número de cliques
app.post('/clicks', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao ler o arquivo' });
    }

    try {
      const jsonData = JSON.parse(data);
      jsonData.click += 1;

      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ error: 'Erro ao salvar os dados' });
        }

        res.json({ clicks: jsonData.click });
      });
    } catch (parseErr) {
      res.status(500).json({ error: 'Erro ao processar os dados' });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
