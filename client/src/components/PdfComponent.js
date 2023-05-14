import React, { useState } from 'react';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';
import '../App.css'

export default function PdfComponent(){


const API_ENDPOINT = 'http://localhost:8000';

  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);

  async function fetchPdf() {
    try {
      const response = await axios.get(`${API_ENDPOINT}/file/${1}`, {
        responseType: 'arraybuffer',
      });
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
      const doc = await PDFDocument.load(response.data);
      setPdfUrl(url);
      setPdfDoc(doc);
    } catch (error) {
      console.error(error);
    }
  }

  async function savePdf() {
  try {
    if (!pdfDoc) {
      throw new Error('PDF document not loaded');
    }

    const existingPdfBytes = await pdfDoc.save();
    const formData = new FormData();
    const file = new File([existingPdfBytes], 'updated.pdf', { type: 'application/pdf' });
    formData.append('file', file);

   

    // Create a new anchor element
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfUrl;
    downloadLink.download = 'updated.pdf';

    // Programmatically click the anchor element to initiate the download
    downloadLink.click();

    // Remove the PDF URL from state to close the iframe tag
    setPdfUrl(null);
    setPdfDoc(null);
  } catch (error) {
    console.error(error);
  }
}

    return (
        <>
        <div>
      <button onClick={fetchPdf} className='btn'>Load PDF</button>
      <button onClick={savePdf} className='btn'>Save PDF</button>
      {pdfUrl ? (
        <iframe src={pdfUrl} title="PDF Viewer" width="100%" height="600px"></iframe>
      ) : (
        ''
      )}
    </div>
        </>
    )
}