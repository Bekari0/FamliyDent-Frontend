import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const STATUS_LABELS: Record<string, string> = {
 confirmed: 'Подтверждена',
 completed: 'Завершена',
 cancelled: 'Отменена',
 canceled: 'Отменена',
 pending: 'Ожидает',
 no_show: 'Не явился',
};

export const formatPdfStatus = (value: unknown) => {
 const status = String(value || '').trim();
 return STATUS_LABELS[status] || status || 'Не указано';
};

export const formatPdfDate = (value: unknown) => {
 if (!value) return 'Дата не указана';
 const date = new Date(String(value));
 if (Number.isNaN(date.getTime())) return String(value);
 return date.toLocaleDateString('ru-RU');
};

export const exportToPDF = async (title: string, headers: string[], data: any[][], fileName: string) => {
 const container = document.createElement('div');
 container.style.position = 'fixed';
 container.style.left = '-10000px';
 container.style.top = '0';
 container.style.width = '1120px';
 container.style.padding = '32px';
 container.style.fontFamily = 'Arial, "Noto Sans", "DejaVu Sans", sans-serif';
 container.style.color = '#24211f';
 container.style.background = '#ffffff';
 container.style.boxSizing = 'border-box';

 const safeHeaders = headers.map((header) => escapeHtml(repairMojibake(String(header || ''))));
 const rows = (Array.isArray(data) ? data : [])
 .map((row) => `
 <tr>
 ${safeHeaders.map((_, index) => `<td>${escapeHtml(repairMojibake(String(row?.[index] ?? 'Нет данных')))}</td>`).join('')}
 </tr>
 `)
 .join('');

 container.innerHTML = `
 <style>
 * { box-sizing: border-box; }
 .pdf-brand { font-size: 18px; font-weight: 800; color: #2c2a28; letter-spacing: 0; margin-bottom: 4px; }
 .pdf-accent { color: #a77a25; }
 .pdf-title { font-size: 24px; line-height: 1.25; font-weight: 800; margin: 0 0 8px; color: #24211f; }
 .pdf-meta { font-size: 13px; color: #5f5a54; margin: 0 0 22px; }
 table { width: 100%; border-collapse: collapse; table-layout: fixed; }
 th { background: #2c2a28; color: #ffffff; font-size: 12px; line-height: 1.3; padding: 10px 8px; text-align: left; border: 1px solid #2c2a28; }
 td { border: 1px solid #d8d3cc; font-size: 12px; line-height: 1.4; padding: 9px 8px; vertical-align: top; word-break: break-word; overflow-wrap: anywhere; white-space: normal; color: #24211f; }
 tr:nth-child(even) td { background: #f7f5f1; }
 .pdf-empty { border: 1px solid #d8d3cc; padding: 18px; color: #5f5a54; font-size: 14px; border-radius: 8px; }
 </style>
 <div class="pdf-brand">Family<span class="pdf-accent">Dent</span></div>
 <h1 class="pdf-title">${escapeHtml(repairMojibake(title))}</h1>
 <p class="pdf-meta">Дата формирования: ${new Date().toLocaleString('ru-RU')}</p>
 ${rows
 ? `<table><thead><tr>${safeHeaders.map((header) => `<th>${header}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>`
 : '<div class="pdf-empty">Нет данных для экспорта</div>'}
 `;

 document.body.appendChild(container);

 try {
 await document.fonts?.ready;
 const canvas = await html2canvas(container, {
 scale: 2,
 backgroundColor: '#ffffff',
 useCORS: true,
 logging: false,
 windowWidth: 1120,
 });

 const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
 const pageWidth = pdf.internal.pageSize.getWidth();
 const pageHeight = pdf.internal.pageSize.getHeight();
 const margin = 10;
 const contentWidth = pageWidth - margin * 2;
 const contentHeight = pageHeight - margin * 2;

 const imgWidthPx = canvas.width;
 const pageCanvasHeightPx = Math.floor((contentHeight * imgWidthPx) / contentWidth);
 let renderedHeight = 0;
 let pageIndex = 0;

 while (renderedHeight < canvas.height) {
 const pageCanvas = document.createElement('canvas');
 pageCanvas.width = canvas.width;
 pageCanvas.height = Math.min(pageCanvasHeightPx, canvas.height - renderedHeight);

 const ctx = pageCanvas.getContext('2d');
 if (!ctx) throw new Error('Canvas is not available');
 ctx.fillStyle = '#ffffff';
 ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
 ctx.drawImage(
 canvas,
 0,
 renderedHeight,
 pageCanvas.width,
 pageCanvas.height,
 0,
 0,
 pageCanvas.width,
 pageCanvas.height
 );

 if (pageIndex > 0) pdf.addPage();
 const imgHeightMm = (pageCanvas.height * contentWidth) / pageCanvas.width;
 pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', margin, margin, contentWidth, imgHeightMm);

 renderedHeight += pageCanvas.height;
 pageIndex += 1;
 }

 pdf.save(`${fileName}.pdf`);
 } finally {
 document.body.removeChild(container);
 }
};

function escapeHtml(value: string) {
 return value
 .replace(/&/g, '&amp;')
 .replace(/</g, '&lt;')
 .replace(/>/g, '&gt;')
 .replace(/"/g, '&quot;')
 .replace(/'/g, '&#039;');
}

const CP1251_EXTRA = '\u0402\u0403\u201a\u0453\u201e\u2026\u2020\u2021\u20ac\u2030\u0409\u2039\u040a\u040c\u040b\u040f\u0452\u2018\u2019\u201c\u201d\u2022\u2013\u2014\u2122\u0459\u203a\u045a\u045c\u045b\u045f\u0020\u040e\u045e\u0408\u00a4\u0490\u00a6\u00a7\u0401\u00a9\u0404\u00ab\u00ac\u00ad\u00ae\u0407\u00b0\u00b1\u0406\u0456\u0491\u00b5\u00b6\u00b7\u0451\u2116\u0454\u00bb\u0458\u0405\u0455\u0457';

function repairMojibake(value: string) {
 if (!/[\u0420\u0421\u0403\u040b\u040f\u040c\u040a\u0409\u0406][\u0080-\u04ff]/.test(value)) return value;
 try {
 const bytes = Array.from(value).map((char) => {
 const code = char.charCodeAt(0);
 if (code < 128) return code;
 const extraIndex = CP1251_EXTRA.indexOf(char);
 if (extraIndex >= 0) return 0x80 + extraIndex;
 if (code >= 0x0410 && code <= 0x044F) return code - 0x0410 + 0xC0;
 return null;
 });
 if (bytes.some((byte) => byte === null)) return value;
 const decoded = new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(bytes as number[]));
 return decoded.includes('�') ? value : decoded;
 } catch {
 return value;
 }
}
