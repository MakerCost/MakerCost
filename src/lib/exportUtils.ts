import { Quote, QuoteProduct, ExportSettings } from '@/types/pricing';
import { formatCurrencyWholeNumbers } from './calculations';
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import * as XLSX from 'xlsx';
import { createElement } from 'react';

// Import our new React PDF template component - dynamic import to avoid SSR issues
const loadReactPdfTemplate = async () => {
  const { default: ReactPdfQuoteTemplate } = await import('@/components/pdf/ReactPdfQuoteTemplate');
  return ReactPdfQuoteTemplate;
};

// New optimized PDF Export using @react-pdf/renderer for better file size and text selection

export const exportQuoteToPDF = async (quote: Quote, exportSettings?: ExportSettings) => {
  // Only run in browser environment
  if (typeof window === 'undefined') {
    throw new Error('PDF export only available in browser environment');
  }

  try {
    // Load the React PDF template component
    const ReactPdfQuoteTemplate = await loadReactPdfTemplate();
    
    // Create the PDF document element
    const documentElement = createElement(ReactPdfQuoteTemplate, { 
      quote, 
      exportSettings 
    });
    
    // Generate PDF blob using @react-pdf/renderer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBlob = await pdf(documentElement as any).toBlob();
    
    // Save the PDF file with much smaller size and proper text selection
    saveAs(pdfBlob, `quote-${quote.quoteNumber}.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Provide more specific error messages based on the error type
    if (error instanceof Error) {
      if (error.message.includes('font') || error.message.includes('Font')) {
        throw new Error('Failed to load fonts for PDF. Please try again.');
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Network error during PDF generation. Please check your connection and try again.');
      }
      if (error.message.includes('memory') || error.message.includes('Memory')) {
        throw new Error('Insufficient memory for PDF generation. Please close other applications and try again.');
      }
    }
    
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

// Internal XLSX Export with full cost breakdowns
export const exportQuoteToExcel = (quote: Quote) => {
  const workbook = XLSX.utils.book_new();
  
  // Main Summary Sheet
  const summaryData = [
    ['Quote Summary'],
    ['Quote Number', quote.quoteNumber],
    ['Project Name', quote.projectName],
    ['Client Name', quote.clientName],
    ['Date', quote.createdAt.toLocaleDateString()],
    ['Currency', quote.currency],
    [],
    ['Products Summary'],
    ['Product Name', 'Quantity', 'Unit Price', 'Total Price', 'Net Profit', 'Profit Margin %'],
    ...quote.products.map(product => [
      product.productName,
      product.quantity.toString(),
      formatCurrencyWholeNumbers(product.unitPrice, quote.currency),
      formatCurrencyWholeNumbers(product.totalPrice, quote.currency),
      formatCurrencyWholeNumbers(product.calculations?.netProfit || 0, quote.currency),
      ((product.calculations?.netProfit || 0) / (product.totalPrice || 1) * 100).toFixed(1) + '%'
    ]),
    [],
    ['Quote Totals'],
    ['Subtotal', formatCurrencyWholeNumbers(quote.subtotal, quote.currency)],
    ['Discount', formatCurrencyWholeNumbers(quote.discountAmount, quote.currency)],
    ['Shipping', formatCurrencyWholeNumbers(quote.shippingAmount, quote.currency)],
    ['VAT', formatCurrencyWholeNumbers(quote.vatAmount, quote.currency)],
    ['Total Amount', formatCurrencyWholeNumbers(quote.totalAmount, quote.currency)]
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Quote Summary');
  
  // Individual Product Sheets
  quote.products.forEach((product, index) => {
    if (!product.calculations) return;
    
    const calc = product.calculations;
    const productData = [
      [`Product ${index + 1}: ${product.productName}`],
      [],
      ['Basic Information'],
      ['Product Name', product.productName],
      ['Quantity', product.quantity.toString()],
      ['Unit Price', formatCurrencyWholeNumbers(product.unitPrice, quote.currency)],
      ['Total Price', formatCurrencyWholeNumbers(product.totalPrice, quote.currency)],
      [],
      ['Cost Breakdown'],
      ['Main Materials', formatCurrencyWholeNumbers(calc.cogs.mainMaterials, quote.currency)],
      ['Packaging', formatCurrencyWholeNumbers(calc.cogs.packaging, quote.currency)],
      ['Decorations', formatCurrencyWholeNumbers(calc.cogs.decorations, quote.currency)],
      ['Total COGS', formatCurrencyWholeNumbers(calc.cogs.total, quote.currency)],
      [],
      ['Operating Expenses'],
      ['Machine Costs', formatCurrencyWholeNumbers(calc.operatingExpenses.machineCosts, quote.currency)],
      ['Labor Costs', formatCurrencyWholeNumbers(calc.operatingExpenses.laborCosts, quote.currency)],
      ['Overhead', formatCurrencyWholeNumbers(calc.operatingExpenses.overhead, quote.currency)],
      ['Total Operating Expenses', formatCurrencyWholeNumbers(calc.operatingExpenses.total, quote.currency)],
      [],
      ['Profit Analysis'],
      ['Gross Profit', formatCurrencyWholeNumbers(calc.grossProfit, quote.currency)],
      ['Net Profit', formatCurrencyWholeNumbers(calc.netProfit, quote.currency)],
      ['Gross Margin %', calc.percentOfNetSales.grossProfit.toFixed(1) + '%'],
      ['Net Margin %', calc.percentOfNetSales.netProfit.toFixed(1) + '%'],
      []
    ];
    
    // Add What-If Matrix for this product
    if (calc) {
      productData.push(['What-If Analysis']);
      productData.push(['Price Change %', 'Quantity Change %', 'New Price', 'New Quantity', 'Net Profit', 'Profit Delta']);
      
      const priceScenarios = [-20, -10, 0, 10, 20];
      const quantityScenarios = [-20, -10, 0, 10, 20];
      
      priceScenarios.forEach(priceChange => {
        quantityScenarios.forEach(quantityChange => {
          const newPrice = product.unitPrice * (1 + priceChange / 100);
          const newQuantity = Math.max(1, Math.round(product.quantity * (1 + quantityChange / 100)));
          const scenarioProfit = calc.netProfit * (newPrice / product.unitPrice) * (newQuantity / product.quantity);
          const profitDelta = scenarioProfit - calc.netProfit;
          
          productData.push([
            priceChange + '%',
            quantityChange + '%',
            formatCurrencyWholeNumbers(newPrice, quote.currency),
            newQuantity.toString(),
            formatCurrencyWholeNumbers(scenarioProfit, quote.currency),
            formatCurrencyWholeNumbers(profitDelta, quote.currency)
          ]);
        });
      });
    }
    
    const productSheet = XLSX.utils.aoa_to_sheet(productData);
    XLSX.utils.book_append_sheet(workbook, productSheet, `Product ${index + 1}`);
  });
  
  // Materials Details Sheet
  const materialsData = [
    ['Materials Breakdown by Product'],
    []
  ];
  
  quote.products.forEach((product, productIndex) => {
    materialsData.push([`${product.productName} Materials`]);
    materialsData.push(['Material Name', 'Category', 'Quantity', 'Unit', 'Cost Type', 'Unit Cost', 'Total Cost', 'Waste %']);
    
    product.materials.forEach(material => {
      materialsData.push([
        material.name,
        material.category,
        material.quantity.toString(),
        material.unit === 'custom' ? material.customUnit || '' : material.unit,
        material.costType,
        material.unitCost ? formatCurrencyWholeNumbers(material.unitCost, quote.currency) : '',
        material.totalCost ? formatCurrencyWholeNumbers(material.totalCost, quote.currency) : '',
        (material.wastePercentage || 0) + '%'
      ]);
    });
    
    materialsData.push([]);
  });
  
  const materialsSheet = XLSX.utils.aoa_to_sheet(materialsData);
  XLSX.utils.book_append_sheet(workbook, materialsSheet, 'Materials Details');
  
  // Save Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `quote-${quote.quoteNumber}-internal.xlsx`);
};