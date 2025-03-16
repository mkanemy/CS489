export function getMimeType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();

    const mimeTypes: { [key: string]: string } = {
        'txt': 'text/plain',
        'html': 'text/html',
        'css': 'text/css',
        'js': 'application/javascript',
        'json': 'application/json',
        'xml': 'application/xml',
        'csv': 'text/csv',
        'pdf': 'application/pdf',
        'zip': 'application/zip',
        'tar': 'application/x-tar',
        'rar': 'application/vnd.rar',
        '7z': 'application/x-7z-compressed',
        'mp3': 'audio/mpeg',
        'wav': 'audio/wav',
        'mp4': 'video/mp4',
        'avi': 'video/x-msvideo',
        'mov': 'video/quicktime',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'bmp': 'image/bmp',
        'webp': 'image/webp',
        'svg': 'image/svg+xml',
        'ico': 'image/vnd.microsoft.icon'
    };

    return mimeTypes[extension || ''] || 'application/octet-stream'; // Default MIME type if unknown
}
