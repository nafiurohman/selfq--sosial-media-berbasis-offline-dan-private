// Mobile-friendly file download utilities for PWA

export async function downloadFile(data: string, filename: string, mimeType: string = 'application/json') {
  const blob = new Blob([data], { type: mimeType });
  
  // Detect platform
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isMobile = isIOS || isAndroid;
  const isPWA = window.matchMedia('(display-mode: standalone)').matches;
  
  // Strategy 1: File System Access API (Chrome/Edge Desktop & Android)
  if ('showSaveFilePicker' in window && !isIOS) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'JSON File',
          accept: { [mimeType]: ['.json'] }
        }]
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return Promise.resolve();
    } catch (err: any) {
      // User cancelled or not supported, try next method
      if (err.name !== 'AbortError') {
        console.log('File System Access API failed, trying fallback');
      }
    }
  }
  
  // Strategy 2: Web Share API (Mobile - iOS & Android)
  if (isMobile && navigator.share) {
    try {
      const file = new File([blob], filename, { type: mimeType });
      
      // Check if can share files
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ 
          files: [file], 
          title: 'selfQ Backup',
          text: 'Backup data selfQ'
        });
        return Promise.resolve();
      }
    } catch (err: any) {
      // Share failed or cancelled, try fallback
      if (err.name !== 'AbortError') {
        console.log('Web Share API failed, trying fallback');
      }
    }
  }
  
  // Strategy 3: Direct download (Universal fallback)
  return forceDownload(blob, filename);
}

function forceDownload(blob: Blob, filename: string) {
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    
    // Trigger download
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    return Promise.resolve();
  } catch (err) {
    console.error('Force download failed:', err);
    return Promise.reject(err);
  }
}