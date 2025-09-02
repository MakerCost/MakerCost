'use client';

import { Quote, ExportSettings } from '@/types/pricing';
import { formatCurrencyWholeNumbers, calculateNetPriceForDisplay } from '@/lib/calculations';

interface QuoteTemplateProps {
  quote: Quote;
  exportSettings?: ExportSettings;
}

// Function to detect Hebrew characters
const detectHebrewText = (text: string): boolean => {
  const hebrewRegex = /[\u0590-\u05FF]/;
  return hebrewRegex.test(text);
};

export default function QuoteTemplate({ quote, exportSettings }: QuoteTemplateProps) {
  // Detect Hebrew text for font selection (but document remains left-aligned)
  const hasHebrewText = detectHebrewText(quote.projectName) || 
    detectHebrewText(quote.clientName) || 
    quote.products.some(p => detectHebrewText(p.productName));

  // Get VAT settings from first product (assuming all products have same VAT settings)
  const vatSettings = quote.products[0]?.vatSettings || { rate: 0, isInclusive: true };

  // Calculate net amounts for display
  const subtotalNet = calculateNetPriceForDisplay(quote.subtotal, vatSettings);
  const discountNet = quote.discountAmount > 0 ? calculateNetPriceForDisplay(quote.discountAmount, vatSettings) : 0;
  const shippingNet = quote.shippingAmount > 0 ? calculateNetPriceForDisplay(quote.shippingAmount, vatSettings) : 0;

  // Custom footer text with business name substitution
  const getFooterText = () => {
    const businessName = exportSettings?.businessName || 'MakerCost';
    const defaultText = `Thank you for choosing ${businessName}. We look forward to bringing your project to life!\n\nFor any questions or modifications, please don't hesitate to contact us.`;
    
    if (!exportSettings?.customFooterText) return defaultText;
    
    return exportSettings.customFooterText.replace(/\[Business Name\]/g, businessName);
  };

  return (
    <div 
      className="pdf-template" 
      dir="ltr"
      style={{
        fontFamily: hasHebrewText ? '"Assistant", "Arial Unicode MS", Arial, sans-serif' : 'Arial, sans-serif',
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm',
        backgroundColor: 'white',
        color: '#000',
        fontSize: '12px',
        lineHeight: '1.4',
        direction: 'ltr',
        textAlign: 'left'
      }}
    >
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px'
        }}>
          {/* Custom Logo or Default */}
          {exportSettings?.logoUrl ? (
            <img
              src={exportSettings.logoUrl}
              alt="Business Logo"
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
          ) : (
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#3b82f6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              MC
            </div>
          )}
          
          <div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              margin: '0',
              color: '#1f2937'
            }}>
              {exportSettings?.businessName || 'MakerCost'}
            </h1>
            <p style={{ 
              margin: '5px 0 0 0', 
              color: '#6b7280',
              fontSize: '14px'
            }}>
              We make sure you profit from your amazing creations
            </p>
          </div>
        </div>
        <div style={{ 
          textAlign: 'right',
          fontSize: '14px',
          color: '#4b5563'
        }}>
          <div style={{ marginBottom: '5px' }}>
            <strong>Date:</strong> {quote.createdAt.toLocaleDateString()}
          </div>
          <div>
            <strong>Currency:</strong> {quote.currency}
          </div>
        </div>
      </div>

      {/* Quote Header */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          margin: '0 0 20px 0',
          color: '#1f2937',
          textAlign: 'center'
        }}>
          Quote {quote.quoteNumber}
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '20px',
          backgroundColor: '#f9fafb',
          padding: '20px',
          borderRadius: '8px'
        }}>
          <div>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              margin: '0 0 10px 0',
              color: '#374151'
            }}>
              Project Information
            </h3>
            <div style={{ marginBottom: '8px' }}>
              <strong>Project:</strong> <span style={{ direction: detectHebrewText(quote.projectName) ? 'rtl' : 'ltr', display: 'inline-block' }}>{quote.projectName}</span>
            </div>
            <div>
              <strong>Client:</strong> <span style={{ direction: detectHebrewText(quote.clientName) ? 'rtl' : 'ltr', display: 'inline-block' }}>{quote.clientName}</span>
            </div>
          </div>
          <div>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              margin: '0 0 10px 0',
              color: '#374151'
            }}>
              Project Terms
            </h3>
            {quote.deliveryDate && (
              <div style={{ marginBottom: '8px' }}>
                <strong>Delivery Date:</strong> <span style={{ direction: 'ltr', display: 'inline-block' }}>{quote.deliveryDate.toLocaleDateString()}</span>
              </div>
            )}
            {quote.paymentTerms && (
              <div style={{ marginBottom: '8px' }}>
                <strong>Payment Terms:</strong> <span style={{ direction: 'ltr', display: 'inline-block' }}>{quote.paymentTerms}</span>
              </div>
            )}
            {!quote.deliveryDate && !quote.paymentTerms && (
              <div style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '14px' }}>
                No terms specified
              </div>
            )}
          </div>
          <div>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              margin: '0 0 10px 0',
              color: '#374151'
            }}>
              Quote Details
            </h3>
            <div style={{ marginBottom: '8px' }}>
              <strong>Total Products:</strong> <span style={{ direction: 'ltr', display: 'inline-block' }}>{quote.products.length}</span>
            </div>
            <div>
              <strong>VAT Rate:</strong> <span style={{ direction: 'ltr', display: 'inline-block' }}>{vatSettings.rate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          margin: '0 0 15px 0',
          color: '#1f2937'
        }}>
          Products
        </h3>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Product Name
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'center',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Quantity
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'center',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Unit Price (Net)
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'center',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Total (Net)
              </th>
            </tr>
          </thead>
          <tbody>
            {quote.products.map((product, index) => {
              const unitPriceNet = calculateNetPriceForDisplay(product.unitPrice, product.vatSettings);
              const totalPriceNet = calculateNetPriceForDisplay(product.totalPrice, product.vatSettings);
              
              return (
                <tr key={product.id} style={{ 
                  backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb'
                }}>
                  <td style={{
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <span style={{ 
                      direction: detectHebrewText(product.productName) ? 'rtl' : 'ltr',
                      display: 'inline-block'
                    }}>
                      {product.productName}
                    </span>
                  </td>
                  <td style={{
                    padding: '12px',
                    textAlign: 'center',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    {product.quantity}
                  </td>
                  <td style={{
                    padding: '12px',
                    textAlign: 'center',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    {formatCurrencyWholeNumbers(unitPriceNet, quote.currency)}
                  </td>
                  <td style={{
                    padding: '12px',
                    textAlign: 'center',
                    borderBottom: '1px solid #e5e7eb',
                    fontWeight: '600'
                  }}>
                    {formatCurrencyWholeNumbers(totalPriceNet, quote.currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Quote Summary */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        marginBottom: '30px'
      }}>
        <div style={{ 
          minWidth: '300px',
          backgroundColor: '#f9fafb',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            margin: '0 0 15px 0',
            color: '#1f2937',
            textAlign: 'left'
          }}>
            Quote Summary
          </h3>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '8px'
          }}>
            <span>Subtotal (Net):</span>
            <span style={{ fontWeight: '500' }}>
              {formatCurrencyWholeNumbers(subtotalNet, quote.currency)}
            </span>
          </div>

          {quote.discountAmount > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '8px',
              color: '#dc2626'
            }}>
              <span>Discount (Net):</span>
              <span style={{ fontWeight: '500' }}>
                -{formatCurrencyWholeNumbers(discountNet, quote.currency)}
              </span>
            </div>
          )}

          {quote.shippingAmount > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '8px'
            }}>
              <span>Shipping (Net):</span>
              <span style={{ fontWeight: '500' }}>
                {formatCurrencyWholeNumbers(shippingNet, quote.currency)}
              </span>
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '12px',
            paddingTop: '8px',
            borderTop: '1px solid #d1d5db'
          }}>
            <span>VAT ({vatSettings.rate}%):</span>
            <span style={{ fontWeight: '500' }}>
              {formatCurrencyWholeNumbers(quote.vatAmount, quote.currency)}
            </span>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '2px solid #374151',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1f2937'
          }}>
            <span>Total (Including VAT):</span>
            <span>
              {formatCurrencyWholeNumbers(quote.totalAmount, quote.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Custom Footer Text */}
      {getFooterText() && (
        <div style={{ 
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#374151',
          lineHeight: '1.6',
          whiteSpace: 'pre-line'
        }}>
          {getFooterText()}
        </div>
      )}

      {/* MakerCost Footer */}
      <div style={{ 
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '11px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '10px',
          gap: '10px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            backgroundColor: '#3b82f6',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            MC
          </div>
          <span style={{ fontSize: '12px', fontWeight: '500' }}>MakerCost</span>
        </div>
        <p style={{ margin: '0 0 5px 0', fontStyle: 'italic' }}>
          We make sure you profit from your amazing creations
        </p>
        <p style={{ margin: '0' }}>
          Quote valid for 30 days from date of issue
        </p>
      </div>
    </div>
  );
}