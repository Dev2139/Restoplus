import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName) => {
    // 1. Prepare data for Excel (Flatten nested objects if necessary)
    const worksheetData = data.map(item => {
        const flatItem = { ...item };
        
        // Flatten payment if it's an object
        if (item.paymentDetails) {
            flatItem.Payment_Method = item.paymentDetails.method;
            flatItem.Payment_Status = item.paymentDetails.status;
            flatItem.Commission = item.paymentDetails.commission;
            flatItem.Net_Amount = item.paymentDetails.netAmount;
            delete flatItem.paymentDetails;
        }

        // Flatten customer if it's an object
        if (item.customerDetails) {
            flatItem.Customer_Name = item.customerDetails.name;
            flatItem.Customer_Phone = item.customerDetails.phone;
            delete flatItem.customerDetails;
        }

        return flatItem;
    });

    // 2. Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Analytics Report");

    // 3. Write and download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
