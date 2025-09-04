'use client';

import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Quote, ExportSettings } from '@/types/pricing';
import { formatCurrencyWholeNumbers, calculateNetPriceForDisplay } from '@/lib/calculations';

// Use built-in React-PDF fonts for reliability
// Times-Roman has better Unicode/Hebrew support than Helvetica

interface ReactPdfQuoteTemplateProps {
  quote: Quote;
  exportSettings?: ExportSettings;
}

// Function to detect Hebrew characters
const detectHebrewText = (text: string): boolean => {
  const hebrewRegex = /[\u0590-\u05FF]/;
  return hebrewRegex.test(text);
};

// Function to get appropriate font family based on text content
const getFontFamily = (text: string): string => {
  // Times-Roman has better Unicode support for Hebrew characters
  return detectHebrewText(text) ? 'Times-Roman' : 'Helvetica';
};

// Function to get text direction based on content
const getTextDirection = (text: string): 'ltr' | 'rtl' => {
  return detectHebrewText(text) ? 'rtl' : 'ltr';
};

// Function to check if any content in quote is Hebrew
const quoteContainsHebrew = (quote: Quote): boolean => {
  return (
    detectHebrewText(quote.projectName) ||
    detectHebrewText(quote.clientName) ||
    quote.products.some(product => detectHebrewText(product.productName))
  );
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottom: '2pt solid #e5e7eb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  logo: {
    width: 50,
    height: 50,
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerRight: {
    textAlign: 'right',
    fontSize: 11,
    color: '#4b5563',
  },
  quoteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 6,
    marginBottom: 25,
    gap: 20,
  },
  infoColumn: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  infoItem: {
    marginBottom: 6,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  table: {
    marginBottom: 25,
  },
  tableTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottom: '1pt solid #e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottom: '1pt solid #e5e7eb',
  },
  tableRowAlternate: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    flex: 1,
  },
  tableCellRight: {
    flex: 1,
    textAlign: 'right',
  },
  tableCellCenter: {
    flex: 1,
    textAlign: 'center',
  },
  summary: {
    alignSelf: 'flex-end',
    minWidth: 250,
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 6,
    marginBottom: 25,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTop: '2pt solid #374151',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  footer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
  },
  brandFooter: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    color: '#6b7280',
    fontSize: 9,
  },
  brandLogo: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  brandText: {
    flexDirection: 'column',
  },
  brandName: {
    fontWeight: 'bold',
    fontSize: 11,
    color: '#374151',
    marginBottom: 2,
  },
  brandSlogan: {
    fontSize: 8,
    color: '#6b7280',
  },
});

// Helper component for rendering text with proper Hebrew/RTL support
interface LocalizedTextProps {
  children: React.ReactNode;
  style?: Record<string, unknown>;
}

const LocalizedText = ({ children, style = {} }: LocalizedTextProps) => {
  const textString = String(children);
  // const isHebrew = detectHebrewText(textString);
  
  const textStyle = {
    ...style,
    fontFamily: getFontFamily(textString),
    direction: getTextDirection(textString),
  };

  return <Text style={textStyle}>{children}</Text>;
};

export default function ReactPdfQuoteTemplate({ quote, exportSettings }: ReactPdfQuoteTemplateProps) {
  // Get VAT settings from first product
  const vatSettings = quote.products[0]?.vatSettings || { rate: 0, isInclusive: true };
  
  // Check if quote contains Hebrew content
  const hasHebrewContent = quoteContainsHebrew(quote);

  // Calculate net amounts for display
  const subtotalNet = calculateNetPriceForDisplay(quote.subtotal, vatSettings);
  const discountNet = quote.discountAmount > 0 ? calculateNetPriceForDisplay(quote.discountAmount, vatSettings) : 0;
  const shippingNet = quote.shippingAmount > 0 ? calculateNetPriceForDisplay(quote.shippingAmount, vatSettings) : 0;

  // Custom footer text with business name substitution
  const getFooterText = () => {
    const businessName = exportSettings?.businessName || 'MakerCost';
    const validityDays = exportSettings?.validityDays || 5;
    const defaultText = `Thank you for choosing ${businessName}. We look forward to bringing your project to life!\n\nFor any questions or modifications, please don't hesitate to contact us.\n\nQuote valid for ${validityDays} days from date of issue.`;
    
    if (!exportSettings?.customFooterText) return defaultText;
    
    return exportSettings.customFooterText.replace(/\[Business Name\]/g, businessName);
  };

  // Create page style with proper font
  const pageStyle = {
    ...styles.page,
    fontFamily: hasHebrewContent ? 'Times-Roman' : 'Helvetica',
  };

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {exportSettings?.logoUrl ? (
              <Image 
                src={exportSettings.logoUrl} 
                style={{ width: 50, height: 50, borderRadius: 6 }}
              />
            ) : (
              <View style={styles.logo}>
                <Text>MC</Text>
              </View>
            )}
            <View>
              <LocalizedText style={styles.businessName}>
                {exportSettings?.businessName || 'MakerCost'}
              </LocalizedText>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text>Date: {quote.createdAt.toLocaleDateString()}</Text>
            <Text>Currency: {quote.currency}</Text>
          </View>
        </View>

        {/* Quote Title */}
        <LocalizedText style={styles.quoteTitle}>Quote {quote.quoteNumber}</LocalizedText>

        {/* Project Information */}
        <View style={styles.infoGrid}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoTitle}>Project Information</Text>
            <View style={styles.infoItem}>
              <LocalizedText><Text style={styles.infoLabel}>Project:</Text> {quote.projectName}</LocalizedText>
            </View>
            <View style={styles.infoItem}>
              <LocalizedText><Text style={styles.infoLabel}>Client:</Text> {quote.clientName}</LocalizedText>
            </View>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoTitle}>Quote Details</Text>
            <View style={styles.infoItem}>
              <Text><Text style={styles.infoLabel}>Delivery Date:</Text> {quote.deliveryDate ? new Date(quote.deliveryDate).toLocaleDateString() : 'TBD'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text><Text style={styles.infoLabel}>Payment Terms:</Text> {quote.paymentTerms || 'Net 30'}</Text>
            </View>
          </View>
        </View>

        {/* Products Table */}
        <View style={styles.table}>
          <Text style={styles.tableTitle}>Products</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Product Name</Text>
            <Text style={styles.tableCellCenter}>Quantity</Text>
            <Text style={styles.tableCellRight}>Unit Price (Net)</Text>
            <Text style={styles.tableCellRight}>Total (Net)</Text>
          </View>
          {quote.products.map((product, index) => {
            const unitPriceNet = calculateNetPriceForDisplay(product.unitPrice, product.vatSettings);
            const totalPriceNet = calculateNetPriceForDisplay(product.totalPrice, product.vatSettings);
            
            return (
              <View 
                key={product.id} 
                style={[
                  styles.tableRow, 
                  ...(index % 2 === 1 ? [styles.tableRowAlternate] : [])
                ]}
              >
                <LocalizedText style={styles.tableCell}>{product.productName}</LocalizedText>
                <Text style={styles.tableCellCenter}>{product.quantity}</Text>
                <Text style={styles.tableCellRight}>
                  {formatCurrencyWholeNumbers(unitPriceNet, quote.currency)}
                </Text>
                <Text style={styles.tableCellRight}>
                  {formatCurrencyWholeNumbers(totalPriceNet, quote.currency)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Quote Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Quote Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text>Subtotal (Net):</Text>
            <Text>{formatCurrencyWholeNumbers(subtotalNet, quote.currency)}</Text>
          </View>

          {quote.discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text>Discount (Net):</Text>
              <Text style={{ color: '#dc2626' }}>
                -{formatCurrencyWholeNumbers(discountNet, quote.currency)}
              </Text>
            </View>
          )}

          {quote.shippingAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text>Shipping (Net):</Text>
              <Text>{formatCurrencyWholeNumbers(shippingNet, quote.currency)}</Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text>VAT / Sales Tax ({vatSettings.rate}%):</Text>
            <Text>{formatCurrencyWholeNumbers(quote.vatAmount, quote.currency)}</Text>
          </View>

          <View style={styles.summaryTotal}>
            <Text>Total (Including VAT / Sales Tax):</Text>
            <Text>{formatCurrencyWholeNumbers(quote.totalAmount, quote.currency)}</Text>
          </View>
        </View>

        {/* Custom Footer Text */}
        {getFooterText() && (
          <View style={styles.footer}>
            <LocalizedText>{getFooterText()}</LocalizedText>
          </View>
        )}

        {/* Brand Footer */}
        <View style={styles.brandFooter}>
          <Image 
            src="/makercost-logo.png" 
            style={styles.brandLogo}
          />
          <View style={styles.brandText}>
            <Text style={styles.brandName}>MakerCost</Text>
            <Text style={styles.brandSlogan}>We make sure you profit from your amazing creations</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}