// Mobile-friendly file download utilities for PWA

export function downloadFile(data: string, filename: string, mimeType: string = 'application/json') {
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Try Web Share API with file for direct download
    if (navigator.share && navigator.canShare) {
      const blob = new Blob([data], { type: mimeType });
      const file = new File([blob], filename, { type: mimeType });
      
      if (navigator.canShare({ files: [file] })) {
        return navigator.share({
          files: [file]
        }).catch(() => {
          // If share fails, force download
          return forceDownload(data, filename, mimeType);
        });
      }
    }
    
    // Force download on mobile
    return forceDownload(data, filename, mimeType);
  }
  
  // Desktop download
  return forceDownload(data, filename, mimeType);
}

function forceDownload(data: string, filename: string, mimeType: string) {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  // Create invisible link and force click
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  
  // Force download by adding to DOM and clicking
  document.body.appendChild(a);
  a.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}