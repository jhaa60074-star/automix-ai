import { PDFParser } from '@/lib/files/pdf';
import { DOCXParser } from '@/lib/files/docx';
import { CSVParser } from '@/lib/files/csv';
import { ExcelParser } from '@/lib/files/excel';

export class FileParser {
  /**
   * Main entry point for extracting text from a file buffer based on MIME type or extension
   */
  static async extractText(buffer: ArrayBuffer, mimeType: string, filename: string): Promise<string> {
    const lowerFilename = filename.toLowerCase();

    if (mimeType === 'application/pdf' || lowerFilename.endsWith('.pdf')) {
      return await PDFParser.extractText(buffer);
    }
    
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || lowerFilename.endsWith('.docx')) {
      return await DOCXParser.extractText(buffer);
    }
    
    if (mimeType === 'text/csv' || lowerFilename.endsWith('.csv')) {
      return await CSVParser.extractText(buffer);
    }
    
    if (mimeType.includes('spreadsheetml') || lowerFilename.endsWith('.xlsx') || lowerFilename.endsWith('.xls')) {
      return await ExcelParser.extractText(buffer);
    }
    
    if (mimeType.startsWith('text/') || lowerFilename.endsWith('.txt')) {
      return new TextDecoder().decode(buffer);
    }

    throw new Error(`Unsupported file type: ${mimeType}`);
  }
}
