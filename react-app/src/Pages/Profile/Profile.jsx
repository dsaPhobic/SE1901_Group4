import React, { useState, useEffect } from "react";
import { User, ClipboardList, CreditCard, LogIn } from "lucide-react";
import "./Profile.css";
import useAuth from "../../Hook/UseAuth";
import useExamAttempts from "../../Hook/UseExamAttempts";
import AppLayout from "../../Components/Layout/AppLayout";

import ProfileTab from "./Tabs/ProfileTab";
import TestHistoryTab from "./Tabs/TestHistoryTab";
import PaymentTab from "./Tabs/PaymentTab";
import SignInTab from "./Tabs/SignInTab";

export default function Profile() {
  const { user, loading, refreshUser } = useAuth();
  const { attempts, loading: attemptsLoading } = useExamAttempts(user?.userId);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: "",
    gmail: "",
    accountName: "",
    password: "",
    avatar: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
        gmail: user.email || "",
        accountName: user.username || "",
        password: "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  if (loading) {
    return (
      <AppLayout title="Profile">
        <div className="profile-layout">
          <div className="profile-main">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout title="Profile">
        <div className="profile-layout">
          <div className="profile-main">Please login</div>
        </div>
      </AppLayout>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileTab
            user={user}
            refreshUser={refreshUser}
            profileData={profileData}
            setProfileData={setProfileData}
          />
        );
      case "test-history":
        return (
          <TestHistoryTab
            attempts={attempts}
            attemptsLoading={attemptsLoading}
          />
        );
      case "payment-history":
        return <PaymentTab />;
      case "sign-in-history":
        return <SignInTab />;
      default:
        return null;
    }
  };

  return (
    <AppLayout title="Profile">
      <div className="profile-layout">
        <div className="profile-sidebar">
          <div className="user-info">
            <div className="user-avatar">
              {profileData.avatar ? (
                <img
                  src={profileData.avatar}
                  alt="User Avatar"
                  className="sidebar-avatar-image"
                />
              ) : (
                <User size={60} />
              )}
            </div>
            <div className="user-details">
              <h3>{profileData.name || "..."}</h3>
              <p>{profileData.gmail || "..."}</p>
            </div>
          </div>

          <div className="navigation-menu">
            {[
              {
                key: "profile",
                icon: <User size={20} />,
                label: "Your Profile",
              },
              {
                key: "test-history",
                icon: <ClipboardList size={20} />,
                label: "Test History",
              },
              {
                key: "payment-history",
                icon: <CreditCard size={20} />,
                label: "Payment History",
              },
              {
                key: "sign-in-history",
                icon: <LogIn size={20} />,
                label: "Sign In History",
              },
            ].map(({ key, icon, label }) => (
              <button
                key={key}
                className={`nav-item ${activeTab === key ? "active" : ""}`}
                onClick={() => setActiveTab(key)}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="profile-main">{renderContent()}</div>
      </div>
    </AppLayout>
  );
}
