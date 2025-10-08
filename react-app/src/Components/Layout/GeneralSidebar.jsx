import Sidebar from "./Sidebar";
import {
  LineChart,
  Book,
  Headphones,
  MessageSquare,
  Pencil,
  MessageCircle,
  Library,
  ShoppingBag,
} from "lucide-react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// ✅ Đăng ký plugin cho Chart.js
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

const menuItems = [
  {
    icon: <LineChart size={20} />,
    label: "Overview",
    active: true,
    path: "/home",
  },
  { icon: <Book size={20} />, label: "Reading", path: "/reading" },
  { icon: <Headphones size={20} />, label: "Listening", path: "/listening" },
  { icon: <MessageSquare size={20} />, label: "Speaking", path: "/speaking" },
  { icon: <Pencil size={20} />, label: "Writing", path: "/writing" },
  { icon: <MessageCircle size={20} />, label: "General", path: "/forum" },
  { icon: <Library size={20} />, label: "Dictionary", path: "/dictionary" },

  {
    icon: <ShoppingBag size={20} />,
    label: "Transaction",
    path: "/transaction",
  },
];

export default function GeneralSidebar() {
  return <Sidebar menuItems={menuItems} />;
}
