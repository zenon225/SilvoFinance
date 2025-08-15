import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'pdfjs-dist/web/pdf_viewer.css';

// Configuration du worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/build/pdf.worker.min.js`;

interface TermsModalProps {
  type: 'terms' | 'privacy';
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ type, onClose }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const pdfFiles = {
    terms: '/fichiers/CGUSILVOFINANCE.pdf',
    privacy: '/fichiers/politiqueconfidencesilvo.pdf'
  };
  

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-300 z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {type === 'terms' ? "Conditions Générales d'Utilisation" : "Politique de Confidentialité"}
          </h2>
          
          <div className="w-full h-[70vh] overflow-auto border border-gray-200 rounded-lg">
            <Document
              file={pdfFiles[type]}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div className="text-center py-20">Chargement du document...</div>}
              error={<div className="text-center py-20 text-red-500">Erreur lors du chargement du document</div>}
            >
              {numPages &&
                Array.from({ length: numPages }, (_, index) => (
                  <Page key={index + 1} pageNumber={index + 1} />
                ))
              }
            </Document>
          </div>

          <div className="mt-4 text-center">
            <a 
              href={pdfFiles[type]} 
              download
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Télécharger le PDF complet
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;