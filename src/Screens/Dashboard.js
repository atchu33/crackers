import React, { useRef, useEffect, useState } from "react";
import {
  FaBox,
  FaTruck,
  FaClipboardList,
  FaFire,
  FaChartLine,
  FaWarehouse,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBoxes,
  FaShoppingCart,
  FaCheckSquare,
  FaTimesCircle,
  FaCalendarAlt,
  FaUsers,
  FaStar,
  FaRegStar,
  FaBolt,
  FaHourglassHalf
} from "react-icons/fa";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PieController } from 'chart.js';
import { Pie } from "react-chartjs-2";
import Layout from "./AdminLayouts";
import axios from "axios";
import localforage from "localforage";
import API_BASE_URL from "./apiConfig";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PieController
);

const FireworksDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Refs for chart instances
  const pieChartRef = useRef(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
  try {
    setLoading(true);
    const token = await localforage.getItem('jwtToken');

    const response = await axios.get(
      `${API_BASE_URL}api/Crackers/GetDashboardOrderStatus`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          companyId: 1 // ✅ Pass companyId here
        }
      }
    );

    if (response.data.statusCode === 200) {
      setDashboardData(response.data.data);
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    setLoading(false);
  }
};


    fetchDashboardData();
  }, []);

  // Cleanup charts on unmount
  useEffect(() => {
    return () => {
      if (pieChartRef.current) {
        pieChartRef.current.destroy();
      }
    };
  }, []);

  if (loading || !dashboardData) {
    return (
      <>
        <Layout />
        <div style={styles.container}>
          <div style={styles.loading}>Loading dashboard...</div>
        </div>
      </>
    );
  }


const allRecentOrders = [...dashboardData.latestPendingDispatchOrders]
  .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)) // Newest first
  .slice(0, 10); // Get more recent orders first (in case few are high-value)

const pendingDispatchOrders = allRecentOrders
  .filter(order => order.payableAmount >= 100000) // 👈 Only high-value orders
  .sort((a, b) => b.payableAmount - a.payableAmount) // Highest amount first
  .slice(0, 4); // Show max 4

const recentOrders = allRecentOrders
  .map(order => ({
    id: order.orderId,
    customer: `${order.customerName}`,
    amount: order.payableAmount,
    status: "processing",
    date: order.orderDate
  }))
  .slice(0, 5); 
  

  return (
    <>
      <Layout />
      <div style={styles.container}>
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryContent}>
              <h3 style={styles.summaryTitle}>Total Orders</h3>
              
            <p style={styles.summaryChange}>
  ₹{Number(dashboardData.totalOrderAmount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
</p>

              <p style={styles.summaryNumber}>{dashboardData.totalOrders} Orders</p>
            </div>
            <FaBoxes style={styles.summaryIcon} />
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryContent}>
              <h3 style={styles.summaryTitle}>Pending Orders</h3>
              
            <p style={styles.summaryChange}>
  ₹{Number(dashboardData.paidButNotDispatched.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
</p>

              <p style={styles.summaryNumber}>{dashboardData.paidButNotDispatched.count} Orders</p>
            </div>
            <FaHourglassHalf style={styles.summaryIcon} />
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryContent}>
              <h3 style={styles.summaryTitle}>Order Dispatch</h3>
              
           <p style={styles.summaryChange}>
  ₹{Number(dashboardData.dispatchedOrders.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
</p>

              <p style={styles.summaryNumber}>{dashboardData.dispatchedOrders.count} Orders</p>
            </div>
            <FaTruck style={styles.summaryIcon} />
          </div>
      
        </div>

        {/* Bottom Section - Top Selling and Recent Orders */}
        <div style={styles.bottomSection}>
          {/* Track Order And Payments */}
         {/* Track Order And Payments */}
<div style={styles.bottomSectionItem}>
  <h2 style={styles.sectionTitle}>
    <FaFire style={{ ...styles.sectionIcon, color: "#FF5722" }} /> 
    Highest Payment Received
  </h2>

  <div style={styles.topSellingContainer}>
    {pendingDispatchOrders && pendingDispatchOrders.length > 0 ? (
      pendingDispatchOrders.map((order, index) => (
        <div key={index} style={styles.topSellingItem}>
          <div style={styles.topSellingRank}>
            #{index + 1}
          </div>
          <div style={styles.topSellingContent}>
            <div style={{ fontWeight: "600", fontSize: "14px" }}>{order.orderId}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {order.firstName} {order.lastName}
            </div>
          </div>
          <div style={{...styles.topSellingStock, fontSize: "14px", fontWeight: "600",color: "#4CAF50"}}>
            ₹{order.payableAmount.toLocaleString('en-IN', {maximumFractionDigits: 2})}
          </div>
        </div>
      ))
    ) : (
      <div style={{ textAlign: "center", color: "#999", padding: "10px",marginTop:"100px"}}>
        No data available
      </div>
    )}
  </div>
</div>


          <div style={styles.bottomSectionItem}>
            <h2 style={styles.sectionTitle}>
              <FaClipboardList style={styles.sectionIcon} /> Recent Orders
            </h2>
            <div style={styles.ordersContainer}>
              {recentOrders.map(order => (
                <div key={order.id} style={styles.orderItem}>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>Order #{order.id}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {order.customer} • {new Date(order.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}> ₹{order.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div style={{
                      fontSize: "12px",
                      color: order.status === "delivered" ? "#4CAF50" : 
                            order.status === "shipped" ? "#2196F3" : "#FF9800",
                      fontWeight: "600"
                    }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f5f7fb",
    minHeight: "100vh",
    padding: "20px",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    fontSize: "16px",
    color: "#666",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    marginBottom: "25px",
  },
  summaryCard: {
    background: "linear-gradient(to bottom, #0fa3ff, #b3eaff)",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 8px 25px rgba(224, 195, 252, 0.4), 0 3px 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    ":hover": {
      transform: "translateY(-5px) scale(1.02)",
    },
  },
  summaryTitle: {
    fontSize: "22px",
    fontWeight: "600",
    margin: "0",
     color: "#042d88",
    textShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  summaryContent: {
    display: "flex",
    flexDirection: "column",

  },
  summaryNumber: {
    fontSize: "18px",
    fontWeight: "600",
    margin: "8px 0 4px",
    color: "#042d88",
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  summaryChange: {
    fontSize: "21px",
    color: "#ffffff",
    fontWeight: "600",
    textShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  summaryIcon: {
    fontSize: "32px",
    color: "#042d88",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
  },
  bottomSection: {
    display: "flex",
    gap: "15px",
  },
  bottomSectionItem: {
  flex: 1,
  backgroundColor: "#fff",
  borderRadius: "8px",
  padding: "15px",
  boxShadow: "0 4px 16px rgba(4, 45, 136, 0.15)",
  transition: "box-shadow 0.3s ease",
  ":hover": {
    boxShadow: "0 8px 24px rgba(4, 45, 136, 0.2)", // Deeper shadow on hover
  },
},
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1a237e",
    margin: "0 0 12px 0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  sectionIcon: {
    fontSize: "16px",
    color: "#FF5722",
  },
  topSellingContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  topSellingItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderRadius: "6px",
    backgroundColor: "#f9f9f9",
  },
  topSellingRank: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: "#1a237e",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "10px",
    fontSize: "11px",
    fontWeight: "bold",
  },
  topSellingContent: {
    flex: 1,
  },
  topSellingStock: {
    fontSize: "11px",
  },
 ordersContainer: {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '0 4px',
  borderRadius: '6px',
  // No maxHeight or overflowY → no scrollbar
},
  orderItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderRadius: "6px",
    backgroundColor: "#f9f9f9",
  },
};

export default FireworksDashboard;