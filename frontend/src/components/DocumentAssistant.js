import React, { useState } from 'react';
import { Upload, FileText, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
    padding: '2rem 1rem'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    padding: '2rem',
    marginBottom: '1.5rem'
  },
  button: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px'
  },
  uploadArea: {
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    padding: '3rem',
    textAlign: 'center',
    cursor: 'pointer'
  }
};

const DocumentAssistant = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [extractionQuery, setExtractionQuery] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setCurrentStep(2);
    }
  };

  const handleExtraction = async () => {
    if (!extractionQuery.trim()) return;
    
    setProcessing(true);
    setCurrentStep(3);
    
    setTimeout(() => {
      setExtractedData({
        rows: 15,
        columns: ['Company', 'Revenue', 'Date', 'Status'],
        preview: [
          ['Acme Corp', '$1.2M', '2024-01-15', 'Active'],
          ['Tech Solutions', '$850K', '2024-02-01', 'Pending'],
          ['Global Industries', '$2.1M', '2024-01-28', 'Active']
        ]
      });
      setProcessing(false);
      setCurrentStep(4);
    }, 3000);
  };

  const generateReport = () => {
    setProcessing(true);
    setTimeout(() => {
      setReportGenerated(true);
      setProcessing(false);
      setCurrentStep(5);
    }, 2000);
  };

  return (
    <div style={styles.container}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        <header style={{textAlign: 'center', marginBottom: '2rem'}}>
          <h1 style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem'}}>
            AI Document Assistant
          </h1>
          <p style={{color: '#6b7280', maxWidth: '600px', margin: '0 auto'}}>
            Extract exactly what you need from documents in plain English, convert to Excel, and generate actionable reports
          </p>
        </header>

        {/* Progress Steps */}
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '3rem'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} style={{display: 'flex', alignItems: 'center'}}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: currentStep >= step ? '#2563eb' : '#e5e7eb',
                  color: currentStep >= step ? 'white' : '#6b7280'
                }}>
                  {step}
                </div>
                {step < 5 && (
                  <div style={{
                    width: '48px',
                    height: '4px',
                    backgroundColor: currentStep > step ? '#2563eb' : '#e5e7eb',
                    marginLeft: '8px'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Upload Document */}
        {currentStep >= 1 && (
          <div style={styles.card}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
              <Upload size={24} color="#2563eb" style={{marginRight: '12px'}} />
              <h2 style={{fontSize: '1.25rem', fontWeight: '600', margin: 0}}>Step 1: Upload Document</h2>
              {uploadedFile && <CheckCircle size={20} color="#10b981" style={{marginLeft: 'auto'}} />}
            </div>
            
            {!uploadedFile ? (
              <div style={styles.uploadArea}>
                <FileText size={64} color="#9ca3af" style={{margin: '0 auto 1rem'}} />
                <p style={{color: '#6b7280', marginBottom: '1rem'}}>Upload your document (PDF, Word, Image)</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  style={{display: 'none'}}
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  style={styles.button}
                >
                  Choose File
                </label>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: '#f0fdf4',
                borderRadius: '8px',
                border: '1px solid #bbf7d0'
              }}>
                <FileText size={32} color="#059669" style={{marginRight: '12px'}} />
                <div>
                  <p style={{fontWeight: '500', color: '#065f46', margin: 0}}>{uploadedFile.name}</p>
                  <p style={{fontSize: '14px', color: '#059669', margin: 0}}>
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Extraction Query */}
        {currentStep >= 2 && (
          <div style={styles.card}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
              <FileText size={24} color="#2563eb" style={{marginRight: '12px'}} />
              <h2 style={{fontSize: '1.25rem', fontWeight: '600', margin: 0}}>
                Step 2: What data do you want to extract?
              </h2>
              {extractionQuery && currentStep > 2 && (
                <CheckCircle size={20} color="#10b981" style={{marginLeft: 'auto'}} />
              )}
            </div>
            
            <div style={{marginBottom: '1rem'}}>
              <textarea
                value={extractionQuery}
                onChange={(e) => setExtractionQuery(e.target.value)}
                placeholder="Describe what data you want to extract in plain English. For example: 'Extract all company names, their revenue figures, and contract dates from this document'"
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  resize: 'none',
                  fontSize: '16px'
                }}
                rows="4"
                disabled={currentStep > 2}
              />
            </div>
            
            {currentStep === 2 && (
              <button
                onClick={handleExtraction}
                disabled={!extractionQuery.trim()}
                style={{
                  ...styles.button,
                  opacity: !extractionQuery.trim() ? 0.5 : 1,
                  cursor: !extractionQuery.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                Extract Data
              </button>
            )}
          </div>
        )}

        {/* Step 3: Processing */}
        {currentStep === 3 && processing && (
          <div style={styles.card}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
              <Loader2 size={24} color="#2563eb" style={{marginRight: '12px', animation: 'spin 1s linear infinite'}} />
              <h2 style={{fontSize: '1.25rem', fontWeight: '600', margin: 0}}>Step 3: Processing Document</h2>
            </div>
            
            <div style={{textAlign: 'center', padding: '2rem'}}>
              <Loader2 size={48} color="#2563eb" style={{margin: '0 auto 1rem', animation: 'spin 1s linear infinite'}} />
              <p style={{color: '#6b7280'}}>Analyzing document and extracting requested data...</p>
            </div>
          </div>
        )}

        {/* Step 4: Preview Extracted Data */}
        {currentStep >= 4 && extractedData && (
          <div style={styles.card}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
              <CheckCircle size={24} color="#10b981" style={{marginRight: '12px'}} />
              <h2 style={{fontSize: '1.25rem', fontWeight: '600', margin: 0}}>Step 4: Extracted Data Preview</h2>
            </div>
            
            <div style={{marginBottom: '1rem'}}>
              <div style={{display: 'flex', gap: '2rem', fontSize: '14px', color: '#6b7280', marginBottom: '1rem'}}>
                <span>Rows: {extractedData.rows}</span>
                <span>Columns: {extractedData.columns.length}</span>
              </div>
              
              <div style={{overflowX: 'auto'}}>
                <table style={{width: '100%', border: '1px solid #e5e7eb', borderCollapse: 'collapse', borderRadius: '8px'}}>
                  <thead style={{backgroundColor: '#f9fafb'}}>
                    <tr>
                      {extractedData.columns.map((col, idx) => (
                        <th key={idx} style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          borderBottom: '1px solid #e5e7eb'
                        }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {extractedData.preview.map((row, idx) => (
                      <tr key={idx} style={{borderBottom: '1px solid #e5e7eb'}}>
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} style={{
                            padding: '12px 16px',
                            fontSize: '14px',
                            color: '#1f2937'
                          }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div style={{display: 'flex', gap: '1rem', paddingTop: '1rem'}}>
                <button
                  onClick={() => alert('Excel file downloaded!')}
                  style={{
                    ...styles.button,
                    backgroundColor: '#059669'
                  }}
                >
                  <Download size={16} />
                  Download Excel
                </button>
                
                {currentStep === 4 && (
                  <button
                    onClick={generateReport}
                    style={styles.button}
                  >
                    Generate Report
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Generated Report */}
        {currentStep === 5 && (
          <div style={styles.card}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
              <CheckCircle size={24} color="#10b981" style={{marginRight: '12px'}} />
              <h2 style={{fontSize: '1.25rem', fontWeight: '600', margin: 0}}>Step 5: Actionable Report Generated</h2>
            </div>
            
            {processing ? (
              <div style={{textAlign: 'center', padding: '2rem'}}>
                <Loader2 size={48} color="#2563eb" style={{margin: '0 auto 1rem', animation: 'spin 1s linear infinite'}} />
                <p style={{color: '#6b7280'}}>Generating your report...</p>
              </div>
            ) : (
              <div>
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{fontWeight: '600', marginBottom: '0.75rem'}}>Executive Summary</h3>
                  <p style={{color: '#374151', marginBottom: '1rem'}}>
                    Analysis of 15 records shows total revenue of $12.4M across active and pending contracts. 
                    Key insights include 80% active rate and Q1 2024 concentration.
                  </p>
                  
                  <h3 style={{fontWeight: '600', marginBottom: '0.75rem'}}>Key Metrics</h3>
                  <ul style={{color: '#374151', margin: 0, paddingLeft: '1.5rem'}}>
                    <li>Total Revenue: $12.4M</li>
                    <li>Active Contracts: 12 (80%)</li>
                    <li>Pending Contracts: 3 (20%)</li>
                    <li>Average Deal Size: $826K</li>
                  </ul>
                </div>
                
                <button
                  onClick={() => alert('Report downloaded!')}
                  style={styles.button}
                >
                  <Download size={16} />
                  Download Full Report
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DocumentAssistant;