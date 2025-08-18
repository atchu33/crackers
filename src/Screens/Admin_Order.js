import React, { useState, useEffect } from "react";
import Layout from "./AdminLayouts";
import { FiEye, FiFileText, FiTruck } from "react-icons/fi";
import { 
  FaCreditCard, 
  FaMoneyBillAlt,
  FaRupeeSign,
  FaDollarSign,
  FaCashRegister,
  FaWallet 
} from 'react-icons/fa';
import axios from "axios";
import localforage from "localforage";
import API_BASE_URL from "./apiConfig";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const AdminOrder = () => {
  // State variables
  const [phone, setPhone] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentGateway, setPaymentGateway] = useState("");
  const [refNo, setRefNo] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [selectedStatusId, setSelectedStatusId] = useState(0); // 0 for All Orders
  const [viewMode, setViewMode] = useState("details"); // 'payment', 'details', or 'dispatch'
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [lrNumber,setLrNumber]=useState("");
  const [lrDate,setLrDate]= useState("");
  const [dispatchAmount, setDispatchAmount] = useState("");
  // Fetch order statuses on component mount
  useEffect(() => {
   const fetchOrderStatuses = async () => {
  try {
    const token = await localforage.getItem("jwtToken");
    if (!token) {
      console.error("❌ No JWT token found");
      return;
    }

    // ✅ Add CompanyId=1 as query parameter
    const url = `${API_BASE_URL}api/Crackers/GetOrderStatusList?CompanyId=1`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 10000
    });

    if (response.data.statusCode === 200) {
      console.log("✅ Order statuses fetched successfully:", response.data.result);
      setOrderStatuses(response.data.result);
    } else {
      console.warn("⚠️ Failed to fetch order statuses:", response.data.statusDesc);
      alert("Could not load order statuses. Please try again.");
    }
  } catch (error) {
    console.error("❌ Error fetching order statuses:", error);
    alert("Error fetching order statuses. Check your connection or login.");
  }
};

    fetchOrderStatuses();
  }, []);

  // Fetch orders based on selected status

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await localforage.getItem('jwtToken');
    const url = `${API_BASE_URL}api/Crackers/GetOrdersByStatus?Id=${selectedStatusId}&CompanyId=1`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    // For both functions, replace the sorting part with this:
if (response.data.statusCode === 200) {
  const sortedOrders = response.data.result.sort((a, b) => {
    // First try to sort by date (newest first)
    const dateCompare = new Date(b.orderDate) - new Date(a.orderDate);
    if (dateCompare !== 0) return dateCompare;
    
    // If dates are equal, sort by order ID (assuming format ORD1001, ORD1002, etc.)
    const aId = parseInt(a.orderId.replace('ORD', ''));
    const bId = parseInt(b.orderId.replace('ORD', ''));
    return bId - aId; // Higher IDs first
  });
  setOrders(sortedOrders);
} else {
        alert("Failed to fetch orders: " + response.data.statusDesc);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to fetch orders. Please try again.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  fetchOrders();
}, [selectedStatusId]);

  const openModal = (order, mode = "details") => {
    setSelectedOrder(order);
    setViewMode(mode);
    
    // Set appropriate view mode based on order status
    if (order.orderStatusID === 1) { // Ready for Payment
      setViewMode("payment");
      setPaymentMode(order.paymentMode || "");
      setRefNo(order.transactionId || "");
      setPaymentDate(order.paymentDate ? order.paymentDate.split("T")[0] : new Date().toISOString().split("T")[0]);
      setPaymentAmount(order.totalAmount || "");
      setPaymentGateway("");
    } 
    else if (order.orderStatusID === 2) { // Ready for Dispatch
      setViewMode("dispatch");
      setDeliveryMethod(order.deliveryMethod || "");
      setDeliveryDate(order.deliveryDate ? order.deliveryDate.split("T")[0] : new Date().toISOString().split("T")[0]);
      setDeliveryNote(order.deliveryNote || "");
    }
    else {
      setViewMode("details");
    }
    
    setIsModalOpen(true);
  };

const handleUpdatePayment = async () => {
  if (!paymentMode) {
    alert("Please select a payment method.");
    return;
  }
  const payload = {
    OrderID: selectedOrder.orderId,
    PaidAmount: parseFloat(paymentAmount) || 0,
    PaymentMethod: paymentMode,
    ReferenceNumber: refNo || null,
    PaymentDate: paymentDate ? new Date(paymentDate).toISOString() : null,
    orderStatusID: 2., // Ready for Dispatch
     CompanyId: 1,
  };

  try {
    const token = await localforage.getItem("jwtToken");
    const response = await axios.post(
      `${API_BASE_URL}api/Crackers/AddOrderPayment`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.statusCode === 200) {
      alert("Payment updated successfully!");
      await fetchOrders();
      
      // 👉 Send WhatsApp message after successful payment
      try {
        const whatsappPayload = {
          to: selectedOrder.phoneNumber?.startsWith("91") 
               ? selectedOrder.phoneNumber 
               : `91${selectedOrder.phoneNumber}`,
          CusName: `${selectedOrder.customerName || ""} ${selectedOrder.lastName || ""}`.trim() || "Customer",
          orderNumber: selectedOrder.orderId,
           companyName: "SRI GOKILAA CRACKERS" 
        };

        await axios.post(`${API_BASE_URL}api/Whatsapp/SendPayment`, whatsappPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("WhatsApp payment notification sent.");
      } catch (whatsAppError) {
        console.error("Failed to send WhatsApp payment message:", whatsAppError);
        alert("Payment successful, but failed to send WhatsApp message.");
      }

      setIsModalOpen(false);
    } else {
      alert("Failed: " + response.data.statusDesc);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to update payment.");
  }
};
const handleDispatchOrder = async () => {
  if (!deliveryMethod) {
    alert("Please select a delivery method");
    return;
  }
  if (!lrNumber) {
    alert("Please enter LR Number");
    return;
  }
  if (!lrDate) {
    alert("Please select LR Date");
    return;
  }
  if (!dispatchAmount || parseFloat(dispatchAmount) <= 0) {
    alert("Please enter a valid dispatch amount");
    return;
  }

  const payload = {
    OrderID: selectedOrder.orderId,
    PaidAmount: selectedOrder.totalAmount || 0,
    PaymentMethod: selectedOrder.paymentMode || "Online",
    ReferenceNumber: selectedOrder.transactionId || null,
    PaymentDate: selectedOrder.paymentDate
      ? new Date(selectedOrder.paymentDate).toISOString()
      : null,
    DeliveryNote: deliveryNote || "",
    DeliveryMethod: deliveryMethod,
    DeliveryAddress: selectedOrder.address,
    LRNumber: lrNumber,
    LRDate: new Date(lrDate).toISOString(),
    DispatchAmnt: parseFloat(dispatchAmount),
    CompanyId: 1,
   
    orderStatusID: 3 // Dispatched
  };

  try {
    const token = await localforage.getItem("jwtToken");
    const response = await axios.post(
      `${API_BASE_URL}api/Crackers/AddOrderPayment`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.statusCode === 200) {
      alert("Order dispatched successfully!");
      await fetchOrders();

      // 👉 Send WhatsApp dispatch message
      try {
        const whatsappPayload = {
          to: selectedOrder.phoneNumber?.startsWith("91") 
               ? selectedOrder.phoneNumber 
               : `91${selectedOrder.phoneNumber}`,
          CusName: `${selectedOrder.customerName || ""} ${selectedOrder.lastName || ""}`.trim() || "Customer",
          orderNumber: selectedOrder.orderId,
          lrNumber: lrNumber,
          lrDate: lrDate,
          dispatchAmount: parseFloat(dispatchAmount) || 0,
           companyName: "SRI GOKILAA CRACKERS" ,
        };

        await axios.post(`${API_BASE_URL}api/Whatsapp/SendDispatch`, whatsappPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("WhatsApp dispatch notification sent.");
      } catch (whatsAppError) {
        console.error("Failed to send WhatsApp dispatch message:", whatsAppError);
        alert("Dispatch successful, but failed to send WhatsApp message.");
      }

      setIsModalOpen(false);
    } else {
      alert("Failed to dispatch: " + response.data.statusDesc);
    }
  } catch (error) {
    console.error("Dispatch error:", error);
    alert("Failed to dispatch order.");
  }
};

  // Filter orders based on selected filters
  const filteredOrders = orders.filter(order => {
  if (phone) {
  const orderPhone = order.phoneNumber;
  if (!orderPhone || !orderPhone.toString().includes(phone)) {
    return false;
  }
}
    
    const orderDate = new Date(order.orderDate);
    if (fromDate && orderDate < new Date(fromDate)) return false;
    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      if (orderDate > to) return false;
    }
    
    return true;
  });

  const formatDate = (isoDate) => {
    if (!isoDate) return "-";
    return new Date(isoDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (isoDate) => {
    if (!isoDate) return "-";
    return new Date(isoDate).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const token = await localforage.getItem("jwtToken");
      const cleanedPhone = phone ? phone.replace(/\D/g, '') : '';
      const params = new URLSearchParams();
  
      if (cleanedPhone) params.append("phoneNumber", cleanedPhone);
      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);
      params.append("id", selectedStatusId);
     params.append("CompanyId", 1);
      const url = `${API_BASE_URL}api/Crackers/GetOverallOrders?${params.toString()}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      });
  
    // For both functions, replace the sorting part with this:
if (response.data.statusCode === 200) {
  const sortedOrders = response.data.result.sort((a, b) => {
    // First try to sort by date (newest first)
    const dateCompare = new Date(b.orderDate) - new Date(a.orderDate);
    if (dateCompare !== 0) return dateCompare;
    
    // If dates are equal, sort by order ID (assuming format ORD1001, ORD1002, etc.)
    const aId = parseInt(a.orderId.replace('ORD', ''));
    const bId = parseInt(b.orderId.replace('ORD', ''));
    return bId - aId; // Higher IDs first
  });
  setOrders(sortedOrders);
} else {
        alert("No orders found matching your criteria");
        setOrders([]);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch orders. Please check your network connection.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

 const handleReset = () => {
  setPhone("");
  setFromDate("");
  setToDate("");
  // Do NOT change selectedStatusId
  // Just fetch orders again with current status ID
  handleSearch(); // ✅ Reuse search logic with current id
};
const displayedOrders = orders;
 

const generatePDF = async (order) => {
  try {
    setLoading(true);
    const token = await localforage.getItem('jwtToken');
    
    // Fetch detailed order information from API
    const response = await axios.get(
      `${API_BASE_URL}api/Crackers/GetOrderDetailsByOrderId?OrderId=${order.orderId}&CompanyId=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.statusCode !== 200) {
      throw new Error(response.data.statusDesc || "Failed to fetch order details");
    }

    // Transform the API response to match our expected structure
    const apiData = response.data;
    const orderDetails = {
      ...apiData.orderHeader,
      items: apiData.orderLines.map(line => ({
        productName: line.productName,
        quantity: line.qty,
        price: line.productPrice,
        discountedPrice: line.discountedPrice,
        totalPrice: line.totalPrice,
        totalDiscountedPrice: line.finalTotalAmt
      })),
      // Calculate totals from the API response
      subTotal: apiData.totals?.totalProductAmount || 0,
      totalDiscount: apiData.totals?.totalDiscountAmount || 0,
      deliveryCharge: apiData.orderHeader.dispatchAmnt || 0,
      totalAmount: apiData.orderHeader.payableAmount || 
                 apiData.totals?.totalFinalAmount + apiData.orderHeader.dispatchAmnt || 0
    };

    // Now create the PDF with the transformed data
    createPDFWithData(orderDetails);
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF: " + error.message);
  } finally {
    setLoading(false);
  }
};

const createPDFWithData = (order) => {
  const pdfContent = document.createElement("div");
  pdfContent.style.position = "absolute";
  pdfContent.style.left = "-9999px";
  pdfContent.style.padding = "20px";
  pdfContent.style.width = "210mm";
  pdfContent.style.background = "white";
  const customerName = `${order.firstName || ''} ${order.lastName || ''}`.trim() || 'N/A';

  // Reduced items per page to prevent mid-row breaks
  const itemsPerPage = 10;
  const itemChunks = [];
  if (order.items && order.items.length > 0) {
    for (let i = 0; i < order.items.length; i += itemsPerPage) {
      itemChunks.push(order.items.slice(i, i + itemsPerPage));
    }
  } else {
    itemChunks.push([]);
  }

  const pages = itemChunks.map((items, pageIndex) => {
    const isFirstPage = pageIndex === 0;
    const isLastPage = pageIndex === itemChunks.length - 1;
    return `
      <div class="pdf-page" style="page-break-after: ${isLastPage ? 'auto' : 'always'};">
        ${isFirstPage ? `
          <div style="font-family: Arial, sans-serif; border: 2px solid #000; padding: 20px;">
            <h2 style="text-align: center; margin-bottom: 20px;">ORDER DETAILS</h2>
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
              <!-- Left side - Order details -->
              <div style="width: 48%;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="font-weight: bold; width: 100px;">Order No:</td>
                    <td>${order.orderId || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold;">Order Date:</td>
                    <td>${formatDate(order.orderDate)}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold;">Status:</td>
                    <td>
                      <span style="
                        background-color: ${order.orderStatus === 6 ? '#d4edda' : '#f8d7da'};
                        color: ${order.orderStatus === 6 ? '#155724' : '#721c24'};
                        padding: 2px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                      ">
                        ${order.orderStatus === 6 ? 'Completed' : 'Processing'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold;">Payment:</td>
                    <td>${order.paymentMethod || 'Pending'}</td>
                  </tr>
                </table>
              </div>
              <!-- Right side - Customer details -->
              <div style="width: 48%;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="font-weight: bold; width: 100px;">Customer:</td>
                    <td>${customerName}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold;">Phone:</td>
                    <td>${order.phoneNumber || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold;">Address:</td>
                    <td>
                      ${order.address || 'N/A'}<br>
                      ${order.city || ''} ${order.pinCode || ''}<br>
                      ${order.state || ''}, ${order.country || ''}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <h3 style="margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #ddd;">Order Items</h3>
        ` : `
          <div style="font-family: Arial, sans-serif; border: 2px solid #000; padding: 20px;">
            <h3 style="margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #ddd;">
              Order Items (continued) - Page ${pageIndex + 1}
            </h3>
        `}
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; page-break-inside: avoid;">
          <thead>
            <tr style="background-color: #f0f0f0; page-break-inside: avoid;">
              <th style="border: 1px solid #000; padding: 8px; text-align: center;">S.No</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: left;">Product Name</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center;">Qty</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center;">Rate</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center;">Discounted Rate</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${items.length > 0 ? 
              items.map((item, index) => `
                <tr style="page-break-inside: avoid;">
                  <td style="border: 1px solid #000; padding: 8px; text-align: center;">${(pageIndex * itemsPerPage) + index + 1}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${item.productName || 'N/A'}</td>
                  <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.quantity || 0}</td>
                  <td style="border: 1px solid #000; padding: 8px; text-align: center;">₹${formatWithCommas((item.price || 0).toFixed(2))}</td>
                  <td style="border: 1px solid #000; padding: 8px; text-align: center;">₹${formatWithCommas((item.discountedPrice || 0).toFixed(2))}</td>
                  <td style="border: 1px solid #000; padding: 8px; text-align: center;">₹${formatWithCommas((item.totalDiscountedPrice || 0).toFixed(2))}</td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="6" style="border: 1px solid #070606ff; padding: 8px; text-align: center;">No items found</td>
                </tr>
              `}
          </tbody>
        </table>
        ${isLastPage ? `
          <div style="display: flex; justify-content: flex-end;">
            <div style="width: 300px; border-top: 1px solid #000; padding-top: 10px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-weight: bold;">Subtotal:</span>
                <span>₹${formatWithCommas((order.subTotal || 0).toFixed(2))}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-weight: bold;">Discount:</span>
                <span>₹${formatWithCommas((order.totalDiscount || 0).toFixed(2))}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-weight: bold;">Delivery Charge:</span>
                <span>₹${formatWithCommas((order.deliveryCharge || 0).toFixed(2))}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                <span style="font-weight: bold;">Total Amount:</span>
                <span style="font-weight: bold;">₹${formatWithCommas((order.totalAmount || 0).toFixed(2))}</span>
              </div>
            </div>
          </div>
        ` : ''}
        </div>
      </div>
    `;
  });

  pdfContent.innerHTML = pages.join('');
  document.body.appendChild(pdfContent);

  html2canvas(pdfContent, {
    scale: 2,
    logging: false,
    useCORS: true
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm'
    });
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Order_${order.orderId || 'unknown'}.pdf`);
    document.body.removeChild(pdfContent);
  });
};
const formatNumber = (value) => {
  if (!value && value !== 0) return "0.00";
  return parseFloat(value).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
// Format number with commas (Indian format)
const formatWithCommas = (value) => {
  if (!value && value !== 0) return "";
  return Number(value).toLocaleString('en-IN');
};

// Parse back to number (remove commas)
const parseWithoutCommas = (value) => {
  return parseFloat(value.replace(/,/g, '')) || 0;
};
  return (
    <>
      <Layout />
      <div style={styles.container}>
        {/* <div style={styles.titleContainer}>
          <h2 style={styles.title}>Manage Orders</h2>
        </div> */}

        {/* Status Filter Buttons */}
      <div style={styles.statusFilterContainer}>
  <button
    onClick={() => {
      console.log("🔄 Changing status filter to All Orders (0)");
      setSelectedStatusId(0);
    }}
    style={styles.statusButton(selectedStatusId === 0, "#042d88")}
  >
    All Orders
  </button>
  
  {orderStatuses.map(status => (
    <button
      key={status.id}
      onClick={() => {
        console.log(`🔄 Changing status filter to ${status.statusDesc} (${status.id})`);
        setSelectedStatusId(status.id);
      }}
      style={styles.statusButton(selectedStatusId === status.id, "#0056b3")}
    >
      {status.statusDesc}
    </button>
  ))}
</div>

        {/* Filter Section */}
      <div style={styles.filterContainer}>
  <div style={styles.filterRow}>
    <div style={styles.filterGroup}>
      <label style={styles.filterLabel}>Phone Number:</label>
     <input
  type="text"
  value={phone}
  onChange={(e) => {
    const newValue = e.target.value;
    console.log("📞 Phone input changed:", newValue);
    setPhone(newValue);
  }}
  style={styles.input}
  placeholder="Enter phone"
/>
    </div>
    <div style={styles.filterGroup}>
      <label style={styles.filterLabel}>From Date:</label>
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        style={styles.input}
      />
    </div>
    <div style={styles.filterGroup}>
      <label style={styles.filterLabel}>To Date:</label>
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        style={styles.input}
      />
    </div>
    <div style={styles.buttonGroup}>
      <button onClick={handleSearch} style={styles.searchButton}>
        Search
      </button>
      <button onClick={handleReset} style={styles.resetButton}>
        Reset
      </button>
    </div>
  </div>
</div>
        {/* Orders Table */}
<div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
          <tr>
            <th style={styles.th}>S.No</th>
            <th style={styles.th}>Order No</th>
            <th style={styles.th}>Order Date</th>
            <th style={styles.th}>Customer Name</th>
            <th style={styles.th}>Phone Number</th>
            <th style={styles.th}>Address</th>
            {selectedStatusId === 0 && <th style={styles.th}>Status</th>} {/* Only show for All Orders */}
             <th style={styles.th}>Payment Amount</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={styles.noDataRow}>
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={styles.noDataRow}>
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => (
                  <tr key={order.id} style={{ backgroundColor: "#f9f9f9" }}>
                    <td style={styles.tdCenter}>{index + 1}</td>
                    <td style={styles.tdCenter}>
                      <span style={{ 
                        backgroundColor: "#e6f7ff",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        color: "#0056b3"
                      }}>
                        {order.orderId || `ORD${String(order.id).padStart(3, '0')}`}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {formatDate(order.orderDate)} <br />
                      
                    </td>
                    <td style={styles.td}>{order.customerName}</td>
                    <td style={styles.td}>{order.phoneNumber}</td>
                    <td style={{ ...styles.td, ...styles.addressCell }}>
                      {order.address}
                    </td>
                  {selectedStatusId === 0 && (
          <td style={styles.tdCenter}>
            <span style={{
              backgroundColor: order.orderStatusID === 2 ? "#fff3cd" : 
                           order.orderStatusID === 1 ? "#cce5ff" : 
                           order.orderStatusID === 3 ? "#d4edda" : "#f8d7da",
              color: order.orderStatusID === 2 ? "#856404" : 
                     order.orderStatusID === 1 ? "#004085" : 
                     order.orderStatusID === 3 ? "#155724" : "#721c24",
              padding: "4px 8px",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: "bold"
            }}>
              {order.orderStatusName || "New Order"}
            </span>
          </td>
        )}
      <td style={styles.tdRight}>
  ₹{formatNumber(order.payableAmount)}
</td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionContainer}>
                        
                        
                        {/* Only show payment button for status ID 1 (Ready for Payment) */}
                        {order.orderStatusID === 1 && (
                          <button
                            onClick={() => openModal(order, "payment")}
                            style={{
                              ...styles.actionButton,
                              backgroundColor: "#042d88",
                              color: "white",
                            }}
                            title="Payment Details"
                          >
                            <FaCreditCard size={14} />
                          </button>
                        )}
                        
                        {/* Only show dispatch button for status ID 2 (Ready for Dispatch) */}
                        {order.orderStatusID === 2 && (
                          <button
                            onClick={() => openModal(order, "dispatch")}
                            style={{
                              ...styles.actionButton,
                              backgroundColor: "#042d88",
                              color: "white",
                            }}
                            title="Dispatch Details"
                          >
                            <FiTruck size={14} />
                          </button>
                          
                        )}
 
<button
  onClick={() => generatePDF(order)}
  style={{
    ...styles.actionButton,
    backgroundColor: "#28a745",
    color: "white",
  }}
  title="View Document"
>
  <FiFileText size={14} />
</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {viewMode === "payment" ? "Payment Details" : 
                 viewMode === "dispatch" ? "Dispatch Details" : "Order Details"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={styles.closeButton}>
                ×
              </button>
            </div>

            <div style={styles.modalBody}>
              {viewMode === "details" ? (
                <>
                  <div style={styles.customerDetails}>
                    <h4 style={styles.sectionTitle}>Customer Information</h4>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Order ID:</span>
                      <span style={styles.detailValue}>{selectedOrder.orderId || `ORD${String(selectedOrder.id).padStart(3, '0')}`}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Customer Name:</span>
                      <span style={styles.detailValue}>{selectedOrder.firstName} {selectedOrder.lastName}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Phone:</span>
                      <span style={styles.detailValue}>{selectedOrder.phoneNumber}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Email:</span>
                      <span style={styles.detailValue}>{selectedOrder.email || "N/A"}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Order Date:</span>
                      <span style={styles.detailValue}>
                        {formatDate(selectedOrder.orderDate)} at {formatTime(selectedOrder.orderDate)}
                      </span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Status:</span>
                      <span style={styles.detailValue}>{selectedOrder.status}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Address:</span>
                      <span style={styles.detailValue}>{selectedOrder.address}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Payment Mode:</span>
                      <span style={styles.detailValue}>{selectedOrder.paymentMode || "N/A"}</span>
                    </div>
                    {selectedOrder.paymentMode === "Online" && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Transaction ID:</span>
                        <span style={styles.detailValue}>{selectedOrder.transactionId || "N/A"}</span>
                      </div>
                    )}
                    {selectedOrder.orderStatusID === 3 && (
                      <>
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Delivery Method:</span>
                          <span style={styles.detailValue}>{selectedOrder.deliveryMethod || "N/A"}</span>
                        </div>
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Delivery Date:</span>
                          <span style={styles.detailValue}>{selectedOrder.deliveryDate ? formatDate(selectedOrder.deliveryDate) : "N/A"}</span>
                        </div>
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Delivery Notes:</span>
                          <span style={styles.detailValue}>{selectedOrder.deliveryNote || "N/A"}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <h4 style={styles.sectionTitle}>Order Items</h4>
                  <table style={styles.itemsTable}>
                    <thead>
                      <tr>
                        <th style={styles.itemsTh}>Item</th>
                        <th style={styles.itemsTh}>Quantity</th>
                        <th style={styles.itemsTh}>Price</th>
                        <th style={styles.itemsTh}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td style={styles.itemsTd}>{item.productName}</td>
                            <td style={styles.itemsTd}>{item.quantity}</td>
                            <td style={styles.itemsTd}>₹{item.price}</td>
                            <td style={styles.itemsTd}>₹{item.price * item.quantity}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ ...styles.itemsTd, textAlign: "center" }}>
                            No items found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "15px" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={styles.detailRow}>
                        <span style={{ ...styles.detailLabel, fontWeight: "bold" }}>Subtotal:</span>
                        <span style={styles.detailValue}>₹{selectedOrder.subTotal || "0"}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={{ ...styles.detailLabel, fontWeight: "bold" }}>Delivery Charge:</span>
                        <span style={styles.detailValue}>₹{selectedOrder.deliveryCharge || "0"}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={{ ...styles.detailLabel, fontWeight: "bold" }}>Total Amount:</span>
                        <span style={{ ...styles.detailValue, fontWeight: "bold", fontSize: "14px" }}>
                          ₹{selectedOrder.totalAmount || "0"}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : viewMode === "dispatch" ? (
  <>
 
    

 
 {/* Delivery Method only (Delivery Date removed) */}
 <div style={styles.formRow}>
      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Delivery Method:</label>
        <input
          type="text"
          value="Transport"
          disabled
          style={{ ...styles.input, fontWeight: "bold" }}
        />
        {/* Hidden effect to ensure state is set */}
        {deliveryMethod !== "Transport" && setDeliveryMethod("Transport")}
      </div>
      <div style={styles.formGroup}>
        <label style={styles.formLabel}>LR Date:</label>
        <input
          type="date"
          value={lrDate}
          onChange={(e) => setLrDate(e.target.value)}
          style={styles.input}
        />
      </div>
    </div>

    {/* LR Number & Dispatch Amount in Same Row */}
    <div style={styles.formRow}>
      <div style={styles.formGroup}>
        <label style={styles.formLabel}>LR Number:</label>
        <input
          type="text"
          value={lrNumber}
          onChange={(e) => setLrNumber(e.target.value)}
          style={styles.input}
          placeholder="Enter LR number"
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Dispatch Amount:</label>
        <input
          type="text"
          value={dispatchAmount ? formatWithCommas(dispatchAmount) : ""}
          onChange={(e) => {
            const val = parseWithoutCommas(e.target.value);
            setDispatchAmount(val);
          }}
          style={styles.input}
          placeholder="Enter dispatch amount"
          inputMode="numeric"
        />
      </div>
    </div>

    {/* Notes (Left) & Delivery Address (Right) */}
    <div style={styles.formRow}>
      {/* Notes */}
      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Notes:</label>
        <textarea
          value={deliveryNote}
          onChange={(e) => setDeliveryNote(e.target.value)}
          style={{ ...styles.input, minHeight: "80px" }}
          placeholder="Enter any delivery notes"
        />
      </div>
 
  {/* Delivery Address */}
<div style={styles.formGroup}>
  <label style={styles.formLabel}>Delivery Address:</label>
  <textarea
    style={{ ...styles.input, minHeight: "80px", paddingTop: "8px", lineHeight: "1.4" }}
    value={selectedOrder.address}
    onChange={(e) =>
      setSelectedOrder({
        ...selectedOrder,
        address: e.target.value,
      })
    }
    placeholder="Enter delivery address"
  />
</div>
      </div>
   
 

 

 
  </>

) : (
  <>
                  {/* Payment Mode & Reference No in Same Row */}
    <div style={styles.formRow}>
       <div style={styles.formGroup}>
    <label style={styles.formLabel}>Payment Mode:</label>
    <input
      type="text"
      value="Online"
      disabled
      style={{ ...styles.input, fontWeight: "bold"}}
    />
    {/* Hidden field to ensure state is set */}
    {paymentMode !== "Online" && setPaymentMode("Online")}
  </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Reference No:</label>
        <input
          type="text"
          value={refNo}
          onChange={(e) => setRefNo(e.target.value)}
          style={styles.input}
          placeholder="Enter transaction ID"
        />
      </div>
    </div>

    {/* Payment Date & Payment Amount in Same Row */}
    <div style={styles.formRow}>
      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Payment Date:</label>
        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Payment Amount (₹):</label>
        <input
  type="text"
  value={paymentAmount ? formatWithCommas(paymentAmount) : ""}
  onChange={(e) => {
    const val = parseWithoutCommas(e.target.value);
    setPaymentAmount(val);
  }}
  style={styles.input}
  placeholder="Enter payment amount"
  inputMode="numeric"
/>
      </div>
    </div>
                </>
              )}
            </div>

            <div style={styles.modalFooter}>
              <button onClick={() => setIsModalOpen(false)} style={styles.cancelButton}>
                Cancel
              </button>
              {viewMode === "payment" ? (
                <button onClick={handleUpdatePayment} style={styles.updateButton}>
                  Update Payment
                </button>
              ) : viewMode === "dispatch" ? (
                <button onClick={handleDispatchOrder} style={styles.updateButton}>
                  Confirm Dispatch
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
  const styles = {
    container: {
      marginTop: "10px",
      padding: "10px",
    },
    titleContainer: {
      padding: "2px",
      borderRadius: "4px",
      textAlign: "left",
      color: "#fff",
    },
    title: {
      color: "darkblue",
      fontWeight: "900",
      fontSize: "18px",
      marginBottom: "10px",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modal: {
      backgroundColor: "white",
      borderRadius: "12px",
      width: "500px",
      maxWidth: "90vw",
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      display: "flex",
      flexDirection: "column",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 20px",
      borderBottom: "1px solid #e0e0e0",
    },
    modalTitle: {
      margin: 0,
      fontSize: "16px",
      fontWeight: "bold",
      color: "#333",
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "24px",
      color: "#999",
      cursor: "pointer",
      width: "30px",
      height: "30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalBody: {
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    formLabel: {
      fontSize: "13px",
      fontWeight: "bold",
      color: "#333",
    },
    gatewayOptions: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    gatewayOption: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      cursor: "pointer",
    },
    gatewayImage: {
      width: "30px",
      height: "30px",
      borderRadius: "50%",
    },
    modalFooter: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      padding: "16px 20px",
      borderTop: "1px solid #e0e0e0",
    },
    updateButton: {
      backgroundColor: "#042d88",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "bold",
    },
    cancelButton: {
      backgroundColor: "#6c757d",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "13px",
    },
    statusFilterContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      justifyContent: "center",
      alignItems: "center",
      padding: "12px",
      backgroundColor: "#f1f3f5",
      borderRadius: "12px",
      border: "1px solid #e0e0e0ff",
      marginBottom: "15px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },
    statusButton: (isActive, color) => ({
      padding: "6px 14px",
      borderRadius: "20px",
      border: "none",
      backgroundColor: isActive ? color : "#e9ecef",
      color: isActive ? "#fff" : "#495057",
      fontWeight: isActive ? "bold" : "normal",
      fontSize: "13px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      minWidth: "90px",
      boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
    }),
    filterContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginBottom: "15px",
      backgroundColor: "#f8f9fa",
      padding: "10px",
      borderRadius: "8px",
    },
    filterRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      alignItems: "center",
      justifyContent: "center",
    },
    filterGroup: {
      display: "flex",
      alignItems: "center",
      gap: "5px",
      flex: "1",
      minWidth: "140px",
    },
    filterLabel: {
      fontWeight: "bold",
      fontSize: "12px",
      width: "110px",
      color: "#333",
    },
    detailRow: {
    display: "flex",
    marginBottom: "12px",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  detailLabel: {
    fontWeight: "bold",
    fontSize: "13px",
    color: "#333",
    minWidth: "110px",
  },
  detailValue: {
    flex: 1,
    fontSize: "13px",
    padding: "6px 0",
  },

  // Form Row: Two fields side by side
  formRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "12px",
    flexWrap: "wrap",
    width: "100%",
  },

  formGroup: {
    flex: 1,
    minWidth: "200px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  formLabel: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#333",
  },

  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "13px",
    boxSizing: "border-box",
  },

  select: {
    flex: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "13px",
    boxSizing: "border-box",
  },

  // Ensure modal body has enough padding
  modalBody: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
    buttonGroup: {
      display: "flex",
      gap: "10px",
      justifyContent: "center",
      marginTop: "5px",
    },
    searchButton: {
      backgroundColor: "#042d88",
      border: "none",
      color: "white",
      cursor: "pointer",
      padding: "8px 12px",
      fontWeight: "bold",
      fontSize: "12px",
      borderRadius: "4px",
    },
    resetButton: {
      backgroundColor: "#6c757d",
      border: "none",
      color: "white",
      cursor: "pointer",
      padding: "8px 12px",
      fontWeight: "bold",
      fontSize: "12px",
      borderRadius: "4px",
    },
    tableContainer: {
      maxHeight: "340px",
      overflowY: "auto",
      marginBottom: "40px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      backgroundColor: "#1e1e66",
      color: "#fff",
      textAlign: "center",
      fontSize: "12px",
      padding: "8px",
      position: "sticky",
      top: 0,
      zIndex: "1",
      whiteSpace: "nowrap",
    },
    td: {
      padding: "6px",
      border: "1px solid #ccc",
      textAlign: "left",
      fontSize: "12px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
     tdRight: {
      padding: "6px",
      border: "1px solid #ccc",
      textAlign: "right",
      fontSize: "12px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    tdCenter: {
      textAlign: "center",
      padding: "6px",
      border: "1px solid #ccc",
      fontSize: "12px",
    },
    actionContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px",
    },
    actionButton: {
      padding: "6px",
      fontSize: "12px",
      borderRadius: "50%",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "24px",
      height: "24px",
      margin: 0,
    },
    noDataRow: {
      textAlign: "center",
      color: "#666",
      fontStyle: "italic",
      padding: "1rem",
    },
    addressCell: {
      maxWidth: "150px",
      whiteSpace: "normal",
      wordWrap: "break-word",
      lineHeight: "1.3",
    },
    customerDetails: {
      backgroundColor: "#f5f5f5",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "15px",
    },
    detailRow: {
      display: "flex",
      marginBottom: "8px",
    },
    detailLabel: {
      fontWeight: "bold",
      width: "120px",
      fontSize: "13px",
    },
    detailValue: {
      flex: 1,
      fontSize: "13px",
    },
    itemsTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "10px",
    },
    itemsTh: {
      backgroundColor: "#e0e0e0",
      padding: "8px",
      textAlign: "left",
      fontSize: "12px",
    },
    itemsTd: {
      padding: "8px",
      borderBottom: "1px solid #e0e0e0",
      fontSize: "12px",
    },
    sectionTitle: {
      fontSize: "14px",
      fontWeight: "bold",
      margin: "15px 0 8px 0",
      color: "#333",
    },
  };
export default AdminOrder;