const { GoogleSpreadsheet } = require('google-spreadsheet');
const credentials = require('../services/credentials.json');

module.exports = {
  async handleGrades(request, response) {
    const doc = new GoogleSpreadsheet('1-BAUPETyJgRPx_qyMCABUMGfOTOJ6Rb6Vg-VgfIR7vo'); 

    await doc.useServiceAccountAuth(credentials);

    await doc.loadInfo();

    const sheet = await doc.sheetsByIndex[0];

    const rows = await sheet.getRows({ offset: 0 });

    const maxClasses = 60;

    rows.forEach((row) => {
      if (row.missing > maxClasses * 0.25) {
        row.situation = 'Reprovado por falta';
        row.gradeToPass = 0;
        row.save();
      } else {
        const gradeAverage = parseFloat(
          (
            (parseFloat(row.P1) + parseFloat(row.P2) + parseFloat(row.P3)) /
            3 /
            10
          ).toFixed(1)
        );
        if (gradeAverage < 5) {
          row.situation = 'Reprovado por Nota';
          row.gradeToPass = 0;
          row.save();
        } else if (gradeAverage >= 5 && gradeAverage < 7) {
          row.situation = 'Exame final';
          gradeToPass = 10 - gradeAverage;
          row.gradeToPass = gradeToPass.toFixed(1);
          row.save();
        } else {
          row.situation = 'Aprovado';
          row.gradeToPass = 0;
          row.save();
        }
      }
    });
  },
};
