import React, { useState, useEffect } from 'react';
import Navigation from './Components/Navigation';
import Footer from './Components/Footer';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const ShowOrders = () => {
    const [orders, setOrders] = useState([]);
    const { userId } = useParams();

    useEffect(() => {
        axios.get('http://localhost:3001/showOrders')
            .then(response => {
                // Sort orders by createdAt in descending order
                const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
            })
            .catch(error => {
                console.error("Error fetching orders:", error);
            });
    }, []);

    if (orders.length === 0) return <div>Loading...</div>;

    const handleAccept = (orderId) => {
        console.log(`Accepted order ID: ${orderId}`);
    };

    const handleReject = (orderId) => {
        setOrders(orders.filter(order => order._id !== orderId));
        console.log(`Rejected order ID: ${orderId}`);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow container mx-auto p-4">
                <h2 className="text-4xl font-thin mt-10 mb-10">Order Details</h2>
                <div className="flex flex-col items-center"> 
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="border border-purple-400 w-[70rem] p-10 mb-4 rounded shadow-md"
                        >
                            <div className="flex flex-col text-start">
                                <div className="flex flex-row">
                                    <div className="flex flex-col ml-10">                            
                                        <div>
                                            <span className="text-xl font-thin">Item Name:</span>
                                            <p className="text-2xl">{order.itemName}</p>
                                        </div>
                                        <div className="mt-5">
                                            <span className="text-xl font-thin mt-10">Item Code:</span>
                                            <p className="text-2xl">{order.itemCode}</p>
                                        </div>
                                        <div className="mt-5">
                                            <span className="text-xl font-thin mt-10">Category:</span>
                                            <p className="text-2xl">{order.category}</p>
                                        </div>
                                        <div className="mt-5">
                                            <span className="text-xl font-thin">Small:</span>
                                            <p className="text-2xl">{order.small}</p>
                                        </div>
                                        <div className="mt-5">
                                            <span className="text-xl font-thin">Medium:</span>
                                            <p className="text-2xl">{order.medium}</p>
                                        </div>
                                        <div className="mt-5">
                                            <span className="text-xl font-thin">Large:</span>
                                            <p className="text-2xl">{order.large}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col ml-[20rem]">
                                        <div>
                                            <span className="text-xl font-thin">Extra Large:</span>
                                            <p className="text-2xl">{order.extraLarge}</p>
                                        </div>
                                        <div className="mt-5">
                                            <span className="text-xl font-thin">Total Quantity:</span>
                                            <p className="text-2xl">{order.quantity}</p>
                                        </div>
                                        <div className="mt-5">
                                            <span className="text-xl font-thin">Created At:</span>
                                            <p className="text-2xl">{new Date(order.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div className="mt-5">
                                            <span className="text-xl font-thin">Updated At:</span>
                                            <p className="text-2xl">{new Date(order.updatedAt).toLocaleString()}</p>
                                        </div>
                                        <div className="mt-5 mb-10">
                                            <span className="text-xl font-thin ">Needed At:</span>
                                            <p className="text-2xl">{new Date(order.neededDate).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center mt-4">
                                <Link to={`/AcceptAdminOrder/${order._id}/${userId}`}>
                                    <button
                                        onClick={() => handleAccept(order._id)}
                                        className="bg-green-500 text-white px-4 py-2 w-40 h-16 text-xl rounded mr-2 hover:bg-white border hover:border-green-500 hover:text-green-500 transition"
                                    >
                                        Accept
                                    </button>
                                </Link>
                                <button
                                    onClick={() => handleReject(order._id)}
                                    className="bg-red-500 text-white px-4 py-2 w-40 h-16 text-xl rounded mr-2 hover:bg-white border hover:border-red-500 hover:text-red-500 transition"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ShowOrders;
