const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const gerarPDF = (dados, nomeArquivo = 'horario.pdf') => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const caminho = path.join(__dirname, '..', 'pdfs', nomeArquivo);

            // Cria a pasta se não existir
            fs.mkdirSync(path.dirname(caminho), { recursive: true });

            const stream = fs.createWriteStream(caminho);
            doc.pipe(stream);

            doc.fontSize(20).text('Relatório de Horários de Aula', { align: 'center' });
            doc.moveDown();

            Object.entries(dados).forEach(([data, aulas]) => {
                doc.fontSize(14).text(`${data}`, { underline: true });
                doc.moveDown(0.3);

                aulas.forEach(aula => {
                    doc.fontSize(12).text(
                        `Matéria: ${aula.materia} | Início: ${aula.hora_inicio} | Término: ${aula.hora_termino} | Sala: ${aula.sala} | Unidade: ${aula.unidade}`
                    );
                    doc.moveDown(0.2);
                });

                doc.moveDown();
            });

            doc.end();

            stream.on('finish', () => resolve(caminho));
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { gerarPDF };