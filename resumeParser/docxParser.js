const docxParser = async (buffer) => {
  async function extractTextFromDOCXBuffer(docxBuffer) {
    try {
      const result = await mammoth.extractRawText({ buffer: docxBuffer });
      return result.value.trim();
    } catch (error) {
      throw error;
    }
  }

  const resumeText = await extractTextFromDOCXBuffer(buffer);

  return resumeText;
};

module.exports = docxParser;
