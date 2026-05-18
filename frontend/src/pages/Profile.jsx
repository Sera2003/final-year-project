import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Cropper from "react-easy-crop";
import { toast } from "react-toastify";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

// --- helpers for cropping ---
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

async function getCroppedImage(imageSrc, cropPixels) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // output size: same as crop size (square)
  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height
  );

  return canvas.toDataURL("image/jpeg", 0.92);
}

const Profile = () => {
  const { token, backendUrl, userProfile, setUserProfile } = useContext(ShopContext);

  const fileInputRef = useRef(null);

  const [photo, setPhoto] = useState(null);

  // cropping modal states
  const [isCropping, setIsCropping] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Body measurements state
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("metric");
  const [isSavingMeasurements, setIsSavingMeasurements] = useState(false);

  // Populate body measurements from userProfile when it loads
  useEffect(() => {
    if (userProfile?.bodyMeasurements) {
      const m = userProfile.bodyMeasurements;
      if (m.height) setHeight(String(m.height));
      if (m.weight) setWeight(String(m.weight));
      if (m.unit) setUnit(m.unit);
    }
    // If userProfile has a backend profile picture, use it
    if (userProfile?.profilePicture) {
      const picUrl = userProfile.profilePicture.startsWith("http")
        ? userProfile.profilePicture
        : `${backendUrl}${userProfile.profilePicture}`;
      setPhoto(picUrl);
    } else {
      setPhoto(null);
    }
  }, [userProfile, backendUrl]);

  const dataUrlToFile = async (dataUrl, fileName) => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type || "image/jpeg" });
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large. Max size is 5MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setRawImage(previewUrl);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setIsCropping(true);
  };

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const saveCroppedPhoto = async () => {
    try {
      if (!rawImage || !croppedAreaPixels) {
        toast.error("Please crop the image first.");
        return;
      }
      const cropped = await getCroppedImage(rawImage, croppedAreaPixels);
      const croppedFile = await dataUrlToFile(cropped, "profile.jpg");
      const formData = new FormData();
      formData.append("profilePicture", croppedFile);

      const response = await axios.put(`${backendUrl}/api/user/profile`, formData, {
        withCredentials: true,
        
  headers: {
    "Content-Type": "multipart/form-data",
    token: token || localStorage.getItem("token")
  }      
});

      if (!response.data.success) {
        toast.error(response.data.message || "Failed to save profile photo.");
        return;
      }

      if (response.data.user) {
        setUserProfile(response.data.user);
      }

      setPhoto(cropped);
      setIsCropping(false);
      toast.success("Profile photo updated!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to crop image.");
    }
  };

  const cancelCrop = () => {
    setIsCropping(false);
  };

  const removePhoto = async () => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/user/profile`,
        { removeProfilePicture: true },
{
  withCredentials: true,
  headers: { token: token || localStorage.getItem("token") }
}
      );

      if (!response.data.success) {
        toast.error(response.data.message || "Failed to remove profile photo.");
        return;
      }

      if (response.data.user) {
        setUserProfile(response.data.user);
      }

      setPhoto(null);
      toast.success("Profile photo removed.");
    } catch (error) {
      console.error("Remove photo error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to remove profile photo.");
    }
  };

  // --- Save body measurements to backend ---
  const handleSaveMeasurements = async () => {
    if (isSavingMeasurements) return;

    const parsedHeight = height ? parseFloat(height) : null;
    const parsedWeight = weight ? parseFloat(weight) : null;

    // Client-side validation
    if (parsedHeight !== null && (isNaN(parsedHeight) || parsedHeight <= 0 || parsedHeight > 300)) {
      toast.error("Please enter a valid height (1–300 cm).");
      return;
    }
    if (parsedWeight !== null && (isNaN(parsedWeight) || parsedWeight <= 0 || parsedWeight > 500)) {
      toast.error("Please enter a valid weight (1–500 kg).");
      return;
    }

    setIsSavingMeasurements(true);
    try {
      const response = await axios.put(
        `${backendUrl}/api/user/profile`,
        {
          bodyMeasurements: {
            height: parsedHeight,
            weight: parsedWeight,
            unit
          }
        },
{
  withCredentials: true,
  headers: { token: token || localStorage.getItem("token") }
}
      );

      if (response.data.success) {
        toast.success("Body measurements saved!");
        // Update the userProfile context
        if (response.data.user) {
          setUserProfile(response.data.user);
        }
      } else {
        toast.error(response.data.message || "Failed to save measurements.");
      }
    } catch (error) {
      console.error("Save measurements error:", error);
      const msg = error.response?.data?.message || error.message || "Something went wrong.";
      toast.error(msg);
    } finally {
      setIsSavingMeasurements(false);
    }
  };

  if (!token) {
    return (
      <div className="py-10">
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <p className="text-gray-600 mt-3">Please login to view your profile.</p>
        <Link to="/login">
          <button id="profile-go-login" className="mt-5 bg-black text-white px-6 py-2 text-sm">
            Go to Login
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">My Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account, saved looks, and recommendation history.
          </p>
        </div>

        <Link to="/orders">
          <button id="profile-view-orders" className="border px-5 py-2 text-sm">View Orders</button>
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="border rounded-xl p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border bg-gray-50 flex items-center justify-center">
              {photo ? (
                <img src={photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-sm">No Photo</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                id="profile-upload-photo"
                onClick={openFilePicker}
                className="bg-black text-white px-4 py-2 text-sm"
              >
                {photo ? "Change Photo" : "Upload Photo"}
              </button>

              {photo && (
                <button id="profile-remove-photo" onClick={removePhoto} className="border px-4 py-2 text-sm">
                  Remove Photo
                </button>
              )}

              <input
                ref={fileInputRef}
                id="profile-file-input"
                name="profilePicture"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFilePick}
              />
            </div>
          </div>

          <div className="mt-6 border-t pt-5 text-sm text-gray-700 space-y-2">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {userProfile?.name || "—"}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {userProfile?.email || "—"}
            </p>
          </div>
        </div>

        {/* Body Measurements Card */}
        <div className="border rounded-xl p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">Try-On Accuracy</h2>
          <p className="text-sm text-gray-600 mt-1">
            Add your body measurements for a more realistic virtual try-on experience.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="profile-height" className="text-sm font-medium text-gray-700">
                Height {unit === "metric" ? "(cm)" : "(in)"}
              </label>
              <input
                id="profile-height"
                name="height"
                type="number"
                min="1"
                max="300"
                step="0.1"
                placeholder="e.g. 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="profile-weight" className="text-sm font-medium text-gray-700">
                Weight {unit === "metric" ? "(kg)" : "(lb)"}
              </label>
              <input
                id="profile-weight"
                name="weight"
                type="number"
                min="1"
                max="500"
                step="0.1"
                placeholder="e.g. 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="profile-unit" className="text-sm font-medium text-gray-700">
                Unit System
              </label>
              <select
                id="profile-unit"
                name="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
              >
                <option value="metric">Metric (cm / kg)</option>
                <option value="imperial">Imperial (in / lb)</option>
              </select>
            </div>
          </div>

          <button
            id="profile-save-measurements"
            onClick={handleSaveMeasurements}
            disabled={isSavingMeasurements}
            className="mt-5 bg-black text-white px-6 py-2 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingMeasurements ? "Saving..." : "Save Measurements"}
          </button>

          <p className="text-xs text-gray-500 mt-3">
            Your measurements are stored securely and used to improve virtual try-on accuracy.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 border rounded-xl p-6">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <p className="text-sm text-gray-600 mt-1">
          Jump to the most important features.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/saved-looks">
            <div className="border rounded-lg p-5 hover:bg-gray-50 transition">
              <p className="font-medium">Saved Looks</p>
              <p className="text-sm text-gray-600 mt-1">
                View your saved Virtual Try-On results.
              </p>
              <p className="text-sm underline mt-3">Open</p>
            </div>
          </Link>

          <Link to="/recommendation-history">
            <div className="border rounded-lg p-5 hover:bg-gray-50 transition">
              <p className="font-medium">Recommendation History</p>
              <p className="text-sm text-gray-600 mt-1">
                See previous AI outfit suggestions.
              </p>
              <p className="text-sm underline mt-3">Open</p>
            </div>
          </Link>

          <Link to="/ai-stylist">
            <div className="border rounded-lg p-5 hover:bg-gray-50 transition">
              <p className="font-medium">AI Virtual Stylist</p>
              <p className="text-sm text-gray-600 mt-1">
                Generate new outfit recommendations.
              </p>
              <p className="text-sm underline mt-3">Open</p>
            </div>
          </Link>

          <Link to="/virtual-try-on">
            <div className="border rounded-lg p-5 hover:bg-gray-50 transition">
              <p className="font-medium">Virtual Try-On</p>
              <p className="text-sm text-gray-600 mt-1">
                Upload a photo and preview outfits.
              </p>
              <p className="text-sm underline mt-3">Open</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ✅ Crop Modal */}
      {isCropping && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-xl overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Crop your profile photo</h3>
              <p className="text-sm text-gray-600 mt-1">
                Move & zoom until your face fits nicely in the circle.
              </p>
            </div>

            <div className="relative w-full h-[360px] bg-black">
              <Cropper
                image={rawImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="p-4">
              <label htmlFor="profile-crop-zoom" className="text-sm text-gray-700">Zoom</label>
              <input
                id="profile-crop-zoom"
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />

              <div className="mt-4 flex justify-end gap-2">
                <button id="profile-cancel-crop" onClick={cancelCrop} className="border px-4 py-2 text-sm">
                  Cancel
                </button>
                <button
                  id="profile-save-crop"
                  onClick={saveCroppedPhoto}
                  className="bg-black text-white px-4 py-2 text-sm"
                >
                  Save Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
