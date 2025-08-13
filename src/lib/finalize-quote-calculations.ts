import { 
  Quote, 
  CustomerType, 
  FinalizeQuoteViewModel, 
  QuoteLineItem, 
  QuoteShippingLine, 
  QuoteTotals,
  DiscountInfo,
  ShippingInfo,
  Currency 
} from '@/types/pricing';
import { calculateVAT } from './calculations';

/**
 * Creates line items with correct VAT presentation based on customer type
 */
export function createQuoteLineItems(quote: Quote, customerType: CustomerType): QuoteLineItem[] {
  return quote.products.map(product => {
    const vatSettings = product.vatSettings;
    
    // Calculate both ex-VAT and inc-VAT values
    let unitPriceExVat: number;
    let unitPriceIncVat: number;
    
    if (vatSettings.isInclusive) {
      // Product unit price already includes VAT
      unitPriceIncVat = product.unitPrice;
      const vatCalc = calculateVAT(product.unitPrice, vatSettings);
      unitPriceExVat = vatCalc.netAmount;
    } else {
      // Product unit price is ex-VAT
      unitPriceExVat = product.unitPrice;
      const vatCalc = calculateVAT(product.unitPrice, vatSettings);
      unitPriceIncVat = vatCalc.totalAmount;
    }
    
    return {
      id: product.id,
      productName: product.productName,
      quantity: product.quantity,
      unitPriceExVat,
      unitPriceIncVat,
      lineTotalExVat: unitPriceExVat * product.quantity,
      lineTotalIncVat: unitPriceIncVat * product.quantity,
    };
  });
}

/**
 * Creates shipping line item with correct VAT presentation
 */
export function createShippingLine(shipping: ShippingInfo, vatRate: number): QuoteShippingLine {
  let costExVat: number;
  let costIncVat: number;
  let chargeExVat: number;
  let chargeIncVat: number;
  
  if (shipping.includesVAT) {
    // Shipping costs/charges include VAT
    costIncVat = shipping.cost;
    chargeIncVat = shipping.chargeToCustomer;
    
    const costVatCalc = calculateVAT(shipping.cost, { rate: vatRate, isInclusive: true });
    const chargeVatCalc = calculateVAT(shipping.chargeToCustomer, { rate: vatRate, isInclusive: true });
    
    costExVat = costVatCalc.netAmount;
    chargeExVat = chargeVatCalc.netAmount;
  } else {
    // Shipping costs/charges are ex-VAT
    costExVat = shipping.cost;
    chargeExVat = shipping.chargeToCustomer;
    
    const costVatCalc = calculateVAT(shipping.cost, { rate: vatRate, isInclusive: false });
    const chargeVatCalc = calculateVAT(shipping.chargeToCustomer, { rate: vatRate, isInclusive: false });
    
    costIncVat = costVatCalc.totalAmount;
    chargeIncVat = chargeVatCalc.totalAmount;
  }
  
  return {
    costExVat,
    costIncVat,
    chargeExVat,
    chargeIncVat,
    isFreeShipping: shipping.isFreeShipping,
  };
}

/**
 * Calculates discount amounts based on customer type
 */
export function calculateDiscountAmounts(
  discount: DiscountInfo,
  customerType: CustomerType,
  lineItems: QuoteLineItem[],
  shippingLine?: QuoteShippingLine
): { appliedAmountExVat: number; appliedAmountIncVat: number } {
  
  const subtotalExVat = lineItems.reduce((sum, item) => sum + item.lineTotalExVat, 0);
  const subtotalIncVat = lineItems.reduce((sum, item) => sum + item.lineTotalIncVat, 0);
  
  if (discount.type === 'percentage') {
    // Percentage discount - apply to appropriate subtotal based on customer type
    if (customerType === 'private') {
      const appliedAmountIncVat = (subtotalIncVat * discount.amount) / 100;
      const appliedAmountExVat = (subtotalExVat * discount.amount) / 100;
      return { appliedAmountExVat, appliedAmountIncVat };
    } else {
      const appliedAmountExVat = (subtotalExVat * discount.amount) / 100;
      const appliedAmountIncVat = (subtotalIncVat * discount.amount) / 100;
      return { appliedAmountExVat, appliedAmountIncVat };
    }
  } else {
    // Fixed discount - semantics depend on customer type
    if (customerType === 'private') {
      // Private customer: discount is gross (incl. VAT)
      const appliedAmountIncVat = discount.amount;
      // Calculate ex-VAT portion (approximate, since different products may have different VAT rates)
      const averageVatRate = subtotalIncVat > 0 ? ((subtotalIncVat - subtotalExVat) / subtotalIncVat) : 0;
      const appliedAmountExVat = appliedAmountIncVat / (1 + averageVatRate);
      return { appliedAmountExVat, appliedAmountIncVat };
    } else {
      // Business customer: discount is net (ex. VAT)
      const appliedAmountExVat = discount.amount;
      // Calculate inc-VAT portion (approximate)
      const averageVatRate = subtotalExVat > 0 ? ((subtotalIncVat - subtotalExVat) / subtotalExVat) : 0;
      const appliedAmountIncVat = appliedAmountExVat * (1 + averageVatRate);
      return { appliedAmountExVat, appliedAmountIncVat };
    }
  }
}

/**
 * Calculates totals based on customer type
 */
export function calculateQuoteTotals(
  customerType: CustomerType,
  lineItems: QuoteLineItem[],
  shippingLine?: QuoteShippingLine,
  discount?: { appliedAmountExVat: number; appliedAmountIncVat: number },
  vatRate: number = 18
): QuoteTotals {
  
  const subtotalExVat = lineItems.reduce((sum, item) => sum + item.lineTotalExVat, 0);
  const subtotalIncVat = lineItems.reduce((sum, item) => sum + item.lineTotalIncVat, 0);
  
  const shippingExVat = shippingLine?.chargeExVat || 0;
  const shippingIncVat = shippingLine?.chargeIncVat || 0;
  
  const discountExVat = discount?.appliedAmountExVat || 0;
  const discountIncVat = discount?.appliedAmountIncVat || 0;
  
  if (customerType === 'private') {
    // Private Customer: Show grand total (incl. VAT) with optional VAT info
    const grandTotalIncVat = subtotalIncVat + shippingIncVat - discountIncVat;
    const netAmount = subtotalExVat + shippingExVat - discountExVat;
    const vatAmount = grandTotalIncVat - netAmount;
    
    return {
      grandTotalIncVat,
      vatInfoLine: {
        vatAmount,
        netAmount,
      },
    };
  } else {
    // Business Customer: Show detailed breakdown
    // Subtotal includes products + shipping since shipping is shown in the table
    const subtotalWithShippingExVat = subtotalExVat + shippingExVat;
    const netSubtotalExVat = subtotalWithShippingExVat - discountExVat;
    const vatAmount = netSubtotalExVat * (vatRate / 100);
    const totalIncVat = netSubtotalExVat + vatAmount;
    
    return {
      subtotalExVat: subtotalWithShippingExVat, // This now includes shipping
      shippingExVat, // Keep for internal calculations but don't display
      discountExVat,
      vatAmount,
      totalIncVat,
    };
  }
}

/**
 * Main function to create the finalize quote view model
 */
export function createFinalizeQuoteViewModel(
  quote: Quote,
  customerType: CustomerType,
  discount?: DiscountInfo,
  shipping?: ShippingInfo
): FinalizeQuoteViewModel {
  
  // Get VAT rate from first product (assuming all products have same VAT rate)
  const vatRate = quote.products[0]?.vatSettings.rate || 18;
  
  // Create line items
  const lineItems = createQuoteLineItems(quote, customerType);
  
  // Create shipping line if exists
  const shippingLine = shipping ? createShippingLine(shipping, vatRate) : undefined;
  
  // Calculate discount if exists
  const discountCalc = discount 
    ? calculateDiscountAmounts(discount, customerType, lineItems, shippingLine)
    : undefined;
  
  // Calculate totals
  const totals = calculateQuoteTotals(customerType, lineItems, shippingLine, discountCalc, vatRate);
  
  return {
    customerType,
    quote,
    lineItems,
    shippingLine,
    discount: discount && discountCalc ? {
      type: discount.type,
      amount: discount.amount,
      appliedAmountExVat: discountCalc.appliedAmountExVat,
      appliedAmountIncVat: discountCalc.appliedAmountIncVat,
    } : undefined,
    totals,
  };
}