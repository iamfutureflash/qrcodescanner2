import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import {
  Camera,
  Upload,
  X,
  Scan,
  Copy,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import "../App.css";

function HtmlQRCode() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [copied, setCopied] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner>(null);

  const success = (result: string) => {
    setScanResult(result);
    setIsScanning(false);
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
  };

  const error = (err: unknown) => {
    console.warn(err);
  };

  // Initialize Scanner
  useEffect(() => {
    if (isScanning && !scannerRef.current) {
      // Create scanner instance
      const scanner = new Html5QrcodeScanner(
        "reader",
        {
          qrbox: {
            width: 250,
            height: 250,
          },
          fps: 5,
        },
        false,
      );

      scanner.render(success, error);
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [isScanning]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode("reader-file");
      const result = await html5QrCode.scanFile(file, true);
      setScanResult(result);
      html5QrCode.clear();
    } catch (err) {
      alert(
        "Error scanning file. Please try another image or ensure the QR code is clear.",
      );
      console.error(err);
    }
  };

  const copyToClipboard = () => {
    if (!scanResult) return;
    navigator.clipboard.writeText(scanResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetScan = () => {
    setScanResult(null);
    setIsScanning(false);
    setCopied(false);
  };

  return (
    <div className="app-container">
      <div className="glass-card">
        <header className="header">
          <Scan className="icon-main" size={32} />
          <h1>QR Nexus</h1>
          <p>Scan or Upload QR Codes instantly</p>
        </header>

        <div className="content-area">
          {!scanResult ? (
            <>
              {!isScanning ? (
                <div className="action-grid">
                  <button
                    className="action-btn primary"
                    onClick={() => setIsScanning(true)}
                  >
                    <Camera size={24} />
                    <span>Scan Live</span>
                    <small>Use Camera</small>
                  </button>

                  <label className="action-btn secondary">
                    <Upload size={24} />
                    <span>Upload Image</span>
                    <small>Select File</small>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleFileUpload(e);
                      }}
                      hidden
                    />
                  </label>
                </div>
              ) : (
                <div className="scanner-wrapper">
                  <div id="reader"></div>
                  <button
                    className="close-btn"
                    onClick={() => setIsScanning(false)}
                  >
                    <X size={20} /> Cancel
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="result-container">
              <div className="success-icon">
                <CheckCircle size={48} />
              </div>
              <h2>QR Code Detected</h2>
              <div className="result-box">
                <p>{scanResult}</p>
                <button
                  onClick={copyToClipboard}
                  className="icon-btn"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <CheckCircle size={18} className="copied" />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>
              </div>
              <button className="reset-btn" onClick={resetScan}>
                <RefreshCw size={18} /> Scan Another
              </button>
            </div>
          )}
        </div>

        {/* Hidden element for file scanning logic */}
        <div id="reader-file" style={{ display: "none" }}></div>
      </div>

      <footer className="footer">
        <p>Secure Client-Side Scanning • No data sent to servers</p>
      </footer>
    </div>
  );
}

export default HtmlQRCode;
