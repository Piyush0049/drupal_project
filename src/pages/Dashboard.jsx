import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, CartesianGrid } from "recharts";
import Sidebar from "../components/Sidebar";
import { AiOutlineClockCircle } from "react-icons/ai";
import { RiTicketLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import CreateUserModal from "../components/CreateModal";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [node, setNode] = useState(null);
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [radarData, setRadarData] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const baseUrl = import.meta.env.VITE_API_URL;
  const dataTableID = import.meta.env.VITE_API_DATATABLEID;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getUrl = `${baseUrl}/jsonapi/node/mydata/${dataTableID}`;
        const response = await axios.get(getUrl);
        console.log(response.data)

        console.log(response)
        const rawData = response.data.data.attributes.field_mydata.value;
        if (!rawData || typeof rawData !== "object") return;
        const userArray = Object.keys(rawData)
          .filter((key) => key !== "0" && key!=="sample")
          .map((key) => ({
            uid: rawData[key]["0"],
            name: rawData[key]["1"],
            email: rawData[key]["2"],
            role: rawData[key]["3"],
          }));
        console.log(response.data)
        const nodeData = response.data.data;
        setNode(nodeData);
        console.log(nodeData)
        const rows = Object.keys(rawData).map((key) => ({
          key,
          uid: rawData[key]["0"],
          name: rawData[key]["1"],
          email: rawData[key]["2"],
          role: rawData[key]["3"],
        }));
        setData(rows);
        console.log(rows)

        const roleCounts = userArray.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});
        const formattedData = Object.keys(roleCounts).map((role) => ({
          role,
          count: roleCounts[role],
        }));
        setChartData(formattedData);
        setPieData(formattedData);

        const growthData = userArray.map((user, index) => ({
          name: `User ${index + 1}`,
          count: index + 1,
        }));
        setLineData(growthData);
        const cumulativeData = userArray.map((user, index) => ({
          name: `User ${index + 1}`,
          cumulative: (index + 1) * 2,
        }));
        setAreaData(cumulativeData);

        const radarChartData = Object.keys(roleCounts).map((role) => ({
          role,
          value: roleCounts[role] * 10,
        }));
        setRadarData(radarChartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const deleteRow = async (rowKeyToDelete) => {
    if (!window.confirm("Do you really want to delete the user?")) {
      return;
    }
    if (!node) {
      console.log("Not Found!");
      return;
    }
    
    const baseUrl = import.meta.env.VITE_API_URL;
    const dataTableID = import.meta.env.VITE_API_DATATABLEID;
    try {

      const rawData = { ...node.attributes.field_mydata.value };
      if (rawData[rowKeyToDelete]) {
        delete rawData[rowKeyToDelete];
      } else {
        console.warn("Row not found:", rowKeyToDelete);
        return;
      }

      console.log(rawData)

      const payload = {
        data: {
          type: node.type,
          id: dataTableID,
          attributes: {
            field_mydata: {
              value: rawData,
            },
          },
        },
      };

      console.log(payload)
      const response = await axios.patch(
        `${baseUrl}/jsonapi/node/mydata/${dataTableID}`,
        payload,
        {
          headers: {
            "Content-Type": "application/vnd.api+json",
          },
        }
      );
      if (response.status === 200) {
        toast.success("User has been deleted successfully!")
      } else {
        toast.error("An error has occured!")
      }

      console.log("Row deletion successful:", response);
      setData((prevData) => prevData.filter((row) => row.key !== rowKeyToDelete));
      setNode((prevNode) => ({
        ...prevNode,
        attributes: {
          ...prevNode.attributes,
          field_mydata: { value: rawData },
        },
      }));
    } catch (error) {
      console.error("Error deleting row:", error.response || error);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-950 text-gray-400 font-sans">
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onUserCreated={(userData) => {
          console.log("User created:", userData);
        }}
      />
      <div className="flex min-h-screen w-full bg-gray-950 text-white font-sans px-2 xl:px-24">
        <Sidebar showCreateModal={showCreateModal} setShowCreateModal={setShowCreateModal} />
        <div className="flex-1 px-2 py-6 md:p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-teal-300 to-blue-400 flex flex-col items-center justify-center py-3 md:py-6 px-3 rounded-3xl shadow">
              <AiOutlineClockCircle className="text-2xl lg:text-4xl text-white mb-2" />
              <p className="text-white font-semibold mb-1 lg:mb-3 text-xs lg:text-sm">Avg First Reply Time</p>
              <div className="flex items-end justify-center gap-2">
                <h2 className="text-xl lg:text-3xl font-bold">30.15 </h2>
                <h2 className="text-sm lg:text-base font-bold"> min</h2>
              </div>
            </div>
            <div className="bg-gradient-to-r from-pink-300 to-purple-400 flex flex-col items-center justify-center py-3 md:py-6 px-3 rounded-3xl shadow">
              <AiOutlineClockCircle className="text-2xl lg:text-4xl text-white mb-2" />
              <p className="text-white font-semibold mb-1 lg:mb-3 text-xs lg:text-sm">Avg Full Resolve Time</p>
              <div className="flex items-end justify-center gap-2">
                <h2 className="text-xl lg:text-3xl font-bold">22.40</h2>
                <h2 className="text-sm lg:text-base font-bold"> min</h2>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 justify-center">
              <div className="bg-[#0b1327] w-full h-full flex gap-4 items-center justify-center py-3 md:py-0.5 px-3 rounded-2xl shadow">
                <RiTicketLine className="text-2xl text-teal-400" />
                <p className="text-white font-semibold text-sm lg:text-base">Total Tickets</p>
                <h2 className="text-base lg:text-lg font-bold text-teal-400">124</h2>
              </div>
              <div className="bg-[#0b1327] w-full h-full flex gap-4 items-center justify-center  py-3 md:py-0.5 px-3 rounded-2xl shadow">
                <RiTicketLine className="text-2xl text-purple-400" />
                <p className="text-white font-semibold text-sm lg:text-base">Pending Tickets</p>
                <h2 className="text-base lg:text-lg font-bold text-purple-400">34</h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0b1327] p-6 rounded-3xl shadow">
              <h2 className="text-lg font-bold mb-4">Tickets Created vs Tickets Solved</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="10%" stopColor="teal" />
                        <stop offset="100%" stopColor="pink" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="1 1" stroke="#ffffff3a" />
                    <XAxis dataKey="name" stroke="#ffffff" />
                    <YAxis stroke="#ffffff" />
                    <Tooltip contentStyle={{ backgroundColor: "#2D3142", color: "#fff" }} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="url(#lineGradient)"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#0b1327] p-6 rounded-3xl shadow">
              <h2 className="text-lg font-bold mb-4">Number of Tickets / Day</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor="#985dff" />
                        <stop offset="40%" stopColor="#46ecd5" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="1 1" stroke="#ffffff3a" />
                    <XAxis dataKey="role" stroke="#ffffff" />
                    <YAxis stroke="#ffffff" />
                    <Tooltip contentStyle={{ backgroundColor: "#2D3142", color: "#fff" }} />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="url(#barGradient)"
                      barSize={30}
                      radius={[2, 2, 0, 0]}
                      activeBar={{ fill: "url(#barGradient)" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0b1327] p-6 rounded-3xl shadow">
              <h2 className="text-lg font-bold mb-4">Tickets by Type</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <CartesianGrid strokeDasharray="1 1" stroke="#ffffff3a" />
                    <Pie data={pieData} dataKey="count" nameKey="role" outerRadius={80}>
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={["#6366F1", "#F59E0B", "#EF4444"][index % 3]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#2D3142", color: "#fff" }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#0b1327] p-6 rounded-3xl shadow">
              <h2 className="text-lg font-bold mb-4">Cumulative User Growth</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData}>
                    <XAxis dataKey="name" stroke="#ffffff" />
                    <CartesianGrid strokeDasharray="1 1" stroke="#ffffff3a" />
                    <YAxis stroke="#ffffff" />
                    <Tooltip contentStyle={{ backgroundColor: "#2D3142", color: "#fff" }} />
                    <Area type="monotone" dataKey="cumulative" stroke="#10B981" fill="#10B981" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#0b1327] p-6 rounded-3xl shadow">
              <h2 className="text-lg font-bold mb-4">Role Distribution</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#ffffff" />
                    <CartesianGrid strokeDasharray="1 1" stroke="#ffffff3a" />
                    <PolarAngleAxis dataKey="role" stroke="#ffffff" />
                    <PolarRadiusAxis stroke="#ffffff" />
                    <Radar name="Roles" dataKey="value" stroke="#FF6666" fill="#FF6666" fillOpacity={0.6} />
                    <Legend />
                    <Tooltip contentStyle={{ backgroundColor: "#2D3142", color: "#fff" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-[#0b1327] p-6 rounded-3xl shadow">
            <h2 className="text-lg font-bold mb-2">User Details</h2>
            <p className="text-gray-400 mb-4">A detailed table of all registered users in the system.</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#1f2130] text-gray-300">
                    <th className="py-3 px-4 text-left">UID</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Role</th>
                    <th className="py-3 px-4 text-left">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    .filter((user) => (user?.uid) !== "uid" && (user?.uid) !== "sample")
                    .map((user, index) => (
                      <tr key={index} className="border-b border-gray-700 hover:bg-[#3A3E58] transition">
                        <td className="py-3 px-4">{user?.uid}</td>
                        <td className="py-3 px-4">{user?.name ? user?.name : "Null"}</td>
                        <td className="py-3 px-4">{user?.email ? user?.email : "Null"}</td>
                        <td className="py-3 px-4">{user?.role ? user?.role : "Null"}</td>
                        <td onClick={() => deleteRow(user.key)} className="py-3 hover:cursor-pointer px-4 text-red-600 text-lg">
                          <MdDelete />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
