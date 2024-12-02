import React, { useState, useRef } from 'react'; 
import { PDFDocument, rgb } from 'pdf-lib';

const PdfEditorApp = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfURL, setPdfURL] = useState('');
  const [annotations, setAnnotations] = useState([]);
  const [text, setText] = useState('');
  const [blurredAreas, setBlurredAreas] = useState([]);
  const canvasRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(file);
      setPdfURL(URL.createObjectURL(file));
    }
  };

 

  const savePdf = async () => {
    if (!pdfFile) return;

    const existingPdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const page = pdfDoc.getPage(0);
    const { width, height } = page.getSize();  

    annotations.forEach((annotation, index) => {
      const yPosition = height - 50 - (index * 20);  
      page.drawText(annotation, {
        x: 50, 
        y: yPosition, 
        size: 12, 
        color: rgb(0, 0, 0),
      });
    });

    blurredAreas.forEach(({ x, y, width, height }) => {
      page.drawRectangle({
        x,
        y,
        width,
        height,
        color: rgb(1, 1, 1),
        opacity: 0.5, 
      });
    });

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    const link = document.createElement('a');
    link.href = pdfDataUri;
    link.download = 'modified.pdf';
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PDF Editor</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} className="border rounded p-2 mb-4" />
      
      {pdfURL && (
        <div className="relative mb-4">
          <h2 className="text-xl font-semibold">PDF Preview</h2>
          <iframe src={pdfURL} width="100%" height="500px" title="PDF Viewer"></iframe>
          <canvas ref={canvasRef} className="absolute top-0 left-0" width="100%" height="500px" />
        </div>
      )}

      

      <button onClick={savePdf} className="bg-green-500 text-white rounded p-2">Save PDF</button>

     
    </div>
  );
};

export default PdfEditorApp;
