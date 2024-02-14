const pdf2json = require("pdf2json");

const pdfParser = async (buffer) => {
  try {
    function extractTextFromPDFBuffer(pdfBuffer) {
      return new Promise((resolve, reject) => {
        const pdfParser = new pdf2json();
        pdfParser.on("pdfParser_dataError", (errData) =>
          reject(errData.parserError)
        );
        pdfParser.on("pdfParser_dataReady", (pdfData) => {
          const textContent = pdfData.Pages.reduce((acc, page) => {
            page.Texts.forEach((text) => {
              acc += decodeURIComponent(text.R[0].T);
              acc += " "; // add space between words
            });
            return acc;
          }, "");
          resolve(textContent);
        });
        pdfParser.parseBuffer(pdfBuffer);
      });
    }
    const resumeText = await extractTextFromPDFBuffer(buffer);
    return resumeText;
  } catch (error) {
    console.log(error);
  }
};

module.exports = pdfParser;
