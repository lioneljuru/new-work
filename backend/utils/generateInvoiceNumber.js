// File: backend/utils/generateInvoiceNumber.js
export function generateInvoiceNumber(date = new Date()) {
    const prefix = "DN";
    const yyyyMMdd = date.toISOString().split("T")[0].replace(/-/g, ""); // e.g. 20240512
    const random = Math.floor(Math.random() * 9000 + 1000); // 4-digit random
    return `${prefix}-${yyyyMMdd}-${random}`;
}
