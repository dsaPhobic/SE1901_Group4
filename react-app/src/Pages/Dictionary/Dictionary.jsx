import "./Dictionary.css";
import Sidebar from "../../Components/Dashboard/Sidebar";
import HeaderBar from "../../Components/Dashboard/HeaderBar";
import { Trash2, Volume2 } from "lucide-react";

import * as VocabGroupApi from "../../Services/VocabGroupApi";
import * as WordApi from "../../Services/WordApi";

export default function Dictionary() {

  return (
    <div className="home-container">
      <Sidebar />
      <main className="main-content">
        <HeaderBar />
        <div className="dictionary-container">
          <div className="dictionary-header">

          </div>
          <div className="dictionary-content">
            <table>
              <tr>
                <th>Company</th>
                <th>Contact</th>
                <th>Country</th>
              </tr>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}
