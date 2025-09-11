'use client';

import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Quote, ExportSettings, CustomerType, DiscountInfo, ShippingInfo } from '@/types/pricing';
import { formatCurrencyWholeNumbers, calculateNetPriceForDisplay } from '@/lib/calculations';
import { createFinalizeQuoteViewModel } from '@/lib/finalize-quote-calculations';

// Register Hebrew fonts from local files with error handling
try {
  Font.register({
    family: 'Assistant',
    fonts: [
      {
        src: '/fonts/Assistant-Variable.ttf',
        fontWeight: 'normal',
        fontStyle: 'normal',
      },
      {
        src: '/fonts/Assistant-Variable.ttf',
        fontWeight: 'bold',
        fontStyle: 'normal',
      },
      {
        src: '/fonts/Assistant-Variable.ttf',
        fontWeight: 'normal',
        fontStyle: 'italic',
      },
      {
        src: '/fonts/Assistant-Variable.ttf',
        fontWeight: 'bold',
        fontStyle: 'italic',
      }
    ]
  });

  Font.register({
    family: 'Heebo', 
    fonts: [
      {
        src: '/fonts/Heebo-Variable.ttf',
        fontWeight: 'normal',
        fontStyle: 'normal',
      },
      {
        src: '/fonts/Heebo-Variable.ttf', 
        fontWeight: 'bold',
        fontStyle: 'normal',
      },
      {
        src: '/fonts/Heebo-Variable.ttf',
        fontWeight: 'normal',
        fontStyle: 'italic',
      },
      {
        src: '/fonts/Heebo-Variable.ttf', 
        fontWeight: 'bold',
        fontStyle: 'italic',
      }
    ]
  });
  
  console.log('Hebrew fonts registered successfully');
} catch (error) {
  console.warn('Failed to register Hebrew fonts, falling back to built-in fonts:', error);
}

// Use built-in React-PDF fonts for reliability
// Times-Roman has better Unicode/Hebrew support than Helvetica

interface ReactPdfQuoteTemplateProps {
  quote: Quote;
  exportSettings?: ExportSettings;
  shopData?: {
    name?: string;
    logo?: string;
    slogan?: string;
  };
  customerType?: CustomerType;
  discount?: DiscountInfo;
  shipping?: ShippingInfo;
}

// Function to detect Hebrew characters - enhanced with more Unicode ranges
const detectHebrewText = (text: string): boolean => {
  // Hebrew block (U+0590–U+05FF) + Hebrew Presentation Forms (U+FB1D–U+FB4F)
  const hebrewRegex = /[\u0590-\u05FF\uFB1D-\uFB4F]/;
  return hebrewRegex.test(text);
};

// Function to get appropriate font family based on text content
const getFontFamily = (text: string): string => {
  try {
    // Use modern Hebrew fonts for better typography
    if (detectHebrewText(text)) {
      return 'Assistant'; // Beautiful Hebrew font
    }
    return 'Heebo'; // Clean, modern font for English text
  } catch (error) {
    // Fallback to Times-Roman if custom fonts fail
    console.warn('Falling back to Times-Roman:', error);
    return 'Times-Roman';
  }
};

// Function to get text direction based on content
const getTextDirection = (text: string): 'ltr' | 'rtl' => {
  return detectHebrewText(text) ? 'rtl' : 'ltr';
};

// Function to check if any content in quote is Hebrew - enhanced detection
const quoteContainsHebrew = (quote: Quote, shopData?: { name?: string; slogan?: string }): boolean => {
  return (
    detectHebrewText(quote.projectName || '') ||
    detectHebrewText(quote.clientName || '') ||
    quote.products.some(product => detectHebrewText(product.productName || '')) ||
    (shopData?.name ? detectHebrewText(shopData.name) : false) ||
    (shopData?.slogan ? detectHebrewText(shopData.slogan) : false)
  );
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 10,
    fontFamily: 'Helvetica',
    fontSize: 9,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 8,
    borderBottom: '1pt solid #e5e7eb',
    marginBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  logoColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  businessColumn: {
    flexDirection: 'column',
  },
  logo: {
    width: 48,
    height: 48,
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  businessSlogan: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 6,
  },
  dateInfo: {
    fontSize: 9,
    color: '#374151',
    textAlign: 'center',
    marginTop: 8,
  },
  dateItem: {
    marginBottom: 4,
  },
  quoteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
    gap: 10,
  },
  infoColumn: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  infoItem: {
    marginBottom: 4,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  table: {
    marginBottom: 10,
  },
  tableTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    paddingVertical: 6,
    paddingHorizontal: 10,
    border: '1pt solid #d1d5db',
    borderBottom: '1pt solid #d1d5db',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderLeft: '1pt solid #d1d5db',
    borderRight: '1pt solid #d1d5db',
    borderBottom: '1pt solid #d1d5db',
  },
  tableRowAlternate: {
    backgroundColor: '#f9fafb',
  },
  shippingRow: {
    backgroundColor: '#dbeafe',
  },
  subtotalRow: {
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
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
    minWidth: 200,
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    border: '1pt solid #e5e7eb',
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTop: '2pt solid #374151',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  footer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    fontSize: 8,
    color: '#1f2937',
    lineHeight: 1.3,
  },
  brandFooter: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    color: '#374151',
    fontSize: 8,
  },
  brandLogo: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  brandText: {
    flexDirection: 'column',
  },
  brandName: {
    fontWeight: 'bold',
    fontSize: 10,
    color: '#1f2937',
    marginBottom: 2,
  },
  brandSlogan: {
    fontSize: 7,
    color: '#374151',
  },
});

// Helper component for rendering text with proper Hebrew/RTL support
interface LocalizedTextProps {
  children: React.ReactNode;
  style?: Record<string, unknown>;
  align?: 'left' | 'right' | 'center';
}

const LocalizedText = ({ children, style = {}, align }: LocalizedTextProps) => {
  const textString = String(children);
  const isHebrew = detectHebrewText(textString);
  
  const textStyle = {
    ...style,
    fontFamily: getFontFamily(textString),
    direction: getTextDirection(textString),
    textAlign: align || (isHebrew ? 'right' : 'left'),
    // Ensure proper line height for Hebrew text
    lineHeight: isHebrew ? 1.6 : 1.4,
  };

  return <Text style={textStyle}>{children}</Text>;
};

export default function ReactPdfQuoteTemplate({ 
  quote, 
  exportSettings, 
  shopData,
  customerType = 'private',
  discount,
  shipping 
}: ReactPdfQuoteTemplateProps) {
  // Get VAT settings from first product
  const vatSettings = quote.products[0]?.vatSettings || { rate: 0, isInclusive: true };
  
  // Check if quote contains Hebrew content
  const hasHebrewContent = quoteContainsHebrew(quote, shopData);

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

  // Create page style with modern Hebrew fonts and fallback
  const pageStyle = {
    ...styles.page,
    fontFamily: (() => {
      try {
        return hasHebrewContent ? 'Assistant' : 'Heebo';
      } catch (error) {
        return 'Times-Roman'; // Fallback font
      }
    })(),
    // Add RTL support for the entire page if needed
    direction: (hasHebrewContent ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
  };

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            {/* Left side - Logo and Business Info */}
            <View style={styles.headerLeft}>
              <View style={styles.logoColumn}>
                {(shopData?.logo || exportSettings?.logoUrl) ? (
                  <Image 
                    src={shopData?.logo || exportSettings?.logoUrl} 
                    style={styles.logoImage}
                  />
                ) : (
                  <View style={styles.logo}>
                    <Text>MC</Text>
                  </View>
                )}
                
                {/* Date and Currency below logo */}
                <View style={styles.dateInfo}>
                  <View style={styles.dateItem}>
                    <Text><Text style={{ fontWeight: 'bold' }}>Date:</Text> {quote.createdAt.toLocaleDateString()}</Text>
                  </View>
                  <View style={styles.dateItem}>
                    <Text><Text style={{ fontWeight: 'bold' }}>Currency:</Text> {quote.currency}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.businessColumn}>
                <LocalizedText style={styles.businessName}>
                  {shopData?.name || exportSettings?.businessName || 'MakerCost'}
                </LocalizedText>
                {shopData?.slogan && (
                  <LocalizedText style={styles.businessSlogan}>
                    {shopData?.slogan}
                  </LocalizedText>
                )}
                {!shopData?.slogan && (
                  <Text style={styles.businessSlogan}>
                    We make sure you profit from your amazing creations
                  </Text>
                )}
              </View>
            </View>
            
            {/* Right side - Currently empty, matching modal layout */}
            <View></View>
          </View>
          
          {/* Centered Quote Title */}
          <View style={{ textAlign: 'center' }}>
            <LocalizedText style={styles.quoteTitle}>Quote {quote.quoteNumber}</LocalizedText>
          </View>
        </View>

        {/* Project Information Grid - Three columns matching modal */}
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
            <Text style={styles.infoTitle}>Project Terms</Text>
            <View style={styles.infoItem}>
              {quote.deliveryDate ? (
                <Text><Text style={styles.infoLabel}>Delivery Date:</Text> {new Date(quote.deliveryDate).toLocaleDateString()}</Text>
              ) : null}
            </View>
            <View style={styles.infoItem}>
              {quote.paymentTerms ? (
                <Text><Text style={styles.infoLabel}>Payment Terms:</Text> {quote.paymentTerms}</Text>
              ) : null}
            </View>
            {(!quote.deliveryDate && !quote.paymentTerms) && (
              <Text style={{ color: '#374151' }}>No terms specified</Text>
            )}
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoTitle}>Quote Details</Text>
            <View style={styles.infoItem}>
              <Text><Text style={styles.infoLabel}>Total Products:</Text> {quote.products.length}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text><Text style={styles.infoLabel}>VAT / Sales Tax Rate:</Text> {quote.products[0]?.vatSettings.rate || 0}%</Text>
            </View>
          </View>
        </View>

        {/* Products Table */}
        <View style={styles.table}>
          <Text style={styles.tableTitle}>Products</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Product Name</Text>
            <Text style={styles.tableCellCenter}>Quantity</Text>
            <Text style={styles.tableCellRight}>
              Unit Price {customerType === 'private' ? '(incl. VAT / Sales Tax)' : '(ex. VAT / Sales Tax)'}
            </Text>
            <Text style={styles.tableCellRight}>
              Line Total {customerType === 'private' ? '(incl. VAT / Sales Tax)' : '(ex. VAT / Sales Tax)'}
            </Text>
          </View>
          
          {/* Create view model for consistent display logic */}
          {(() => {
            const viewModel = createFinalizeQuoteViewModel(quote, customerType, discount, shipping);
            return viewModel.lineItems.map((item, index) => (
              <View 
                key={item.id} 
                style={[
                  styles.tableRow, 
                  ...(index % 2 === 1 ? [styles.tableRowAlternate] : [])
                ]}
              >
                <LocalizedText style={styles.tableCell}>{item.productName}</LocalizedText>
                <Text style={styles.tableCellCenter}>{item.quantity}</Text>
                <Text style={styles.tableCellRight}>
                  {formatCurrencyWholeNumbers(
                    customerType === 'private' ? item.unitPriceIncVat : item.unitPriceExVat,
                    quote.currency
                  )}
                </Text>
                <Text style={styles.tableCellRight}>
                  {formatCurrencyWholeNumbers(
                    customerType === 'private' ? item.lineTotalIncVat : item.lineTotalExVat,
                    quote.currency
                  )}
                </Text>
              </View>
            ));
          })()}

          {/* Shipping Line Item */}
          {(() => {
            const viewModel = createFinalizeQuoteViewModel(quote, customerType, discount, shipping);
            if (!viewModel.shippingLine) return null;
            
            return (
              <View style={[styles.tableRow, styles.shippingRow]}>
                <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>
                  {viewModel.shippingLine.isFreeShipping ? 'Free Shipping' : 'Shipping'}
                </Text>
                <Text style={styles.tableCellCenter}></Text>
                <Text style={styles.tableCellRight}></Text>
                <Text style={[styles.tableCellRight, { fontWeight: 'bold' }]}>
                  {viewModel.shippingLine.isFreeShipping 
                    ? 'Free'
                    : formatCurrencyWholeNumbers(
                        customerType === 'private' 
                          ? viewModel.shippingLine.chargeIncVat 
                          : viewModel.shippingLine.chargeExVat,
                        quote.currency
                      )
                  }
                </Text>
              </View>
            );
          })()}

          {/* Empty spacing row */}
          <View style={[styles.tableRow, { borderLeft: 'none', borderRight: 'none', borderBottom: 'none' }]}>
            <Text style={styles.tableCell}></Text>
          </View>

          {/* Subtotal Row */}
          {(() => {
            const viewModel = createFinalizeQuoteViewModel(quote, customerType, discount, shipping);
            const productsTotal = customerType === 'private' 
              ? viewModel.lineItems.reduce((sum, item) => sum + item.lineTotalIncVat, 0)
              : viewModel.lineItems.reduce((sum, item) => sum + item.lineTotalExVat, 0);
            
            const shippingTotal = viewModel.shippingLine 
              ? (customerType === 'private' 
                  ? viewModel.shippingLine.chargeIncVat 
                  : viewModel.shippingLine.chargeExVat)
              : 0;
              
            return (
              <View style={[styles.tableRow, styles.subtotalRow]}>
                <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Subtotal:</Text>
                <Text style={styles.tableCellCenter}></Text>
                <Text style={styles.tableCellRight}></Text>
                <Text style={[styles.tableCellRight, { fontWeight: 'bold' }]}>
                  {formatCurrencyWholeNumbers(productsTotal + shippingTotal, quote.currency)}
                </Text>
              </View>
            );
          })()}
        </View>

        {/* Quote Summary - Matching modal design */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Quote Summary</Text>
          
          {(() => {
            const viewModel = createFinalizeQuoteViewModel(quote, customerType, discount, shipping);
            
            if (customerType === 'private') {
              // Private Customer Display
              return (
                <View>
                  {viewModel.totals.vatInfoLine && (
                    <View>
                      <View style={styles.summaryRow}>
                        <Text>Net amount (ex. VAT / Sales Tax):</Text>
                        <Text>{formatCurrencyWholeNumbers(viewModel.totals.vatInfoLine.netAmount, quote.currency)}</Text>
                      </View>
                      <View style={styles.summaryRow}>
                        <Text>VAT / Sales Tax amount:</Text>
                        <Text>{formatCurrencyWholeNumbers(viewModel.totals.vatInfoLine.vatAmount, quote.currency)}</Text>
                      </View>
                      {viewModel.discount && (
                        <View style={styles.summaryRow}>
                          <Text style={{ color: '#dc2626' }}>Discount (incl. VAT / Sales Tax):</Text>
                          <Text style={{ color: '#dc2626' }}>-{formatCurrencyWholeNumbers(viewModel.discount.appliedAmountIncVat, quote.currency)}</Text>
                        </View>
                      )}
                    </View>
                  )}
                  <View style={styles.summaryTotal}>
                    <Text>TOTAL (incl. VAT / Sales Tax):</Text>
                    <Text>{formatCurrencyWholeNumbers(viewModel.totals.grandTotalIncVat!, quote.currency)}</Text>
                  </View>
                </View>
              );
            } else {
              // Business Customer Display
              return (
                <View>
                  <View style={styles.summaryRow}>
                    <Text>SUBTOTAL (ex. VAT / Sales Tax):</Text>
                    <Text>{formatCurrencyWholeNumbers(viewModel.totals.subtotalExVat!, quote.currency)}</Text>
                  </View>
                  {viewModel.totals.discountExVat! > 0 && (
                    <View style={styles.summaryRow}>
                      <Text style={{ color: '#dc2626' }}>Discount (ex. VAT / Sales Tax):</Text>
                      <Text style={{ color: '#dc2626' }}>-{formatCurrencyWholeNumbers(viewModel.totals.discountExVat!, quote.currency)}</Text>
                    </View>
                  )}
                  <View style={styles.summaryRow}>
                    <Text>VAT / Sales Tax ({quote.products[0]?.vatSettings.rate || 18}%):</Text>
                    <Text>{formatCurrencyWholeNumbers(viewModel.totals.vatAmount!, quote.currency)}</Text>
                  </View>
                  <View style={styles.summaryTotal}>
                    <Text>TOTAL INCL VAT / SALES TAX:</Text>
                    <Text>{formatCurrencyWholeNumbers(viewModel.totals.totalIncVat!, quote.currency)}</Text>
                  </View>
                </View>
              );
            }
          })()}
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