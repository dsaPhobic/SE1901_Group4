import React, { useState } from "react";
import { User } from "lucide-react";
import { compressAndUploadImage } from "../../../utils/ImageHelper";
import { updateUser } from "../../../Services/UserApi";
import { useNavigate } from "react-router-dom";

export default function ProfileTab({ user, profileData, setProfileData }) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // ===== Handle input changes =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  // ===== Handle avatar upload =====
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploadingAvatar(true);

    compressAndUploadImage(file)
      .then((url) => {
        setProfileData((prev) => ({ ...prev, avatar: url }));
        setHasChanges(true);
      })
      .catch((err) => {
        alert(err.message || "Failed to upload image");
      })
      .finally(() => {
        setIsUploadingAvatar(false);
      });
  };

  // ===== Save profile changes =====
  const handleSave = () => {
    if (!user) return;
    setIsSaving(true);

    updateUser(user.userId, {
      firstname: profileData.name.split(" ")[0],
      lastname: profileData.name.split(" ").slice(1).join(" "),
      email: profileData.gmail,
      username: profileData.accountName,
      password: profileData.password || undefined,
      avatar: profileData.avatar === "" ? null : profileData.avatar,
    })
      .then(() => {
        alert("Profile updated successfully!");
        window.location.reload(); // bạn muốn reload toàn trang — giữ nguyên
      })
      .catch((err) => {
        console.error("Error saving profile:", err);
        alert("Failed to update profile. Please try again.");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <div className="profile-content">
      <h2>Your Profile</h2>

      <div className="profile-form">
        {/* ===== Name ===== */}
        <div className="form-group">
          <label>Name</label>
          <input
            name="name"
            type="text"
            value={profileData.name}
            onChange={handleChange}
          />
        </div>

        {/* ===== Gmail ===== */}
        <div className="form-group">
          <label>Gmail</label>
          <input
            name="gmail"
            type="email"
            value={profileData.gmail}
            onChange={handleChange}
          />
        </div>

        {/* ===== Account Name ===== */}
        <div className="form-group">
          <label>Account Name</label>
          <input
            name="accountName"
            type="text"
            value={profileData.accountName}
            onChange={handleChange}
          />
        </div>

        {/* ===== Avatar ===== */}
        <div className="form-group">
          <label>Avatar</label>
          <div className="avatar-upload-section">
            <div className="avatar-preview">
              {profileData.avatar ? (
                <img
                  src={profileData.avatar}
                  alt="Avatar"
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  <User size={40} />
                </div>
              )}
            </div>

            <div className="avatar-upload-controls">
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: "none" }}
              />
              <label htmlFor="avatar-upload" className="avatar-upload-btn">
                {isUploadingAvatar ? "Uploading..." : "Upload Avatar"}
              </label>

              {profileData.avatar && (
                <button
                  type="button"
                  className="avatar-remove-btn"
                  onClick={() => {
                    setProfileData((prev) => ({ ...prev, avatar: "" }));
                    setHasChanges(true);
                  }}
                >
                  Remove Avatar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===== Change Password ===== */}
        <div className="form-group">
          <label>Change Password</label>
          <button
            className="save-btn has-changes"
            style={{
              backgroundColor: "#f44336",
              cursor: "pointer",
              opacity: 1,
              fontSize: "28px",
              padding: "10px 20px",
            }}
            onClick={() => navigate("/?mode=forgot")}
          >
            Change Password
          </button>
        </div>

        {/* ===== Save Button ===== */}
        <div className="form-actions">
          <button
            className={`save-btn ${hasChanges ? "has-changes" : ""} ${
              isSaving ? "saving" : ""
            }`}
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
