"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { getVehicleMakes, getVehicleModels, getVehicleYears } from "@/lib/supabase";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomModal: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  // Form states
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Job selection state
  const [jobs, setJobs] = useState({
    ppf: false,
    windowTint: false,
    ceramicCoating: false,
    vinylWrap: false,
  });

  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);

  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    jobs: "",
  });

  // Fetch vehicle makes on component mount
  useEffect(() => {
    async function fetchMakes() {
      try {
        const fetchedMakes = await getVehicleMakes();
        setMakes(fetchedMakes);
      } catch (error) {
        console.error("Error fetching makes:", error);
      }
    }
    fetchMakes();
  }, []);

  // Fetch models when a make is selected
  useEffect(() => {
    async function fetchModels() {
      if (vehicleMake) {
        setLoadingModels(true);
        try {
          const fetchedModels = await getVehicleModels(vehicleMake);
          setModels(fetchedModels);
          setVehicleModel(""); // Reset model selection when make changes
        } catch (error) {
          console.error("Error fetching models:", error);
        }
        setLoadingModels(false);
      }
    }
    fetchModels();
  }, [vehicleMake]);

  // Fetch years when make & model are selected
  useEffect(() => {
    async function fetchYears() {
      if (vehicleMake && vehicleModel) {
        setLoadingYears(true);
        try {
          const fetchedYears = await getVehicleYears(vehicleMake, vehicleModel);
          setYears(fetchedYears);
          setVehicleYear(""); // Reset year selection when model changes
        } catch (error) {
          console.error("Error fetching years:", error);
        }
        setLoadingYears(false);
      }
    }
    fetchYears();
  }, [vehicleModel]);

  // Handle job selection
  const handleJobChange = (job: keyof typeof jobs) => {
    setJobs((prev) => ({ ...prev, [job]: !prev[job] }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {
      fullName: fullName ? "" : "Full name is required.",
      phoneNumber: phoneNumber ? "" : "Phone number is required.",
      email: email ? "" : "Email is required.",
      vehicleMake: vehicleMake ? "" : "Vehicle make is required.",
      vehicleModel: vehicleModel ? "" : "Vehicle model is required.",
      vehicleYear: vehicleYear ? "" : "Vehicle year is required.",
      jobs: Object.values(jobs).some((selected) => selected) ? "" : "Please select at least one job.",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  // Handle form submission
  const handleBooking = async () => {
    if (!validateForm()) return;

    const selectedJobs = Object.entries(jobs)
      .filter(([_, isSelected]) => isSelected)
      .map(([job]) => {
        switch (job) {
          case "ppf":
            return "Paint Protection Film";
          case "windowTint":
            return "Window Tint";
          case "ceramicCoating":
            return "Ceramic Coating";
          case "vinylWrap":
            return "Vehicle Vinyl Wrap";
          default:
            return job;
        }
      })
      .join(", ");

    const serviceDetails = `
      Vehicle Year: ${vehicleYear}
      Vehicle Make: ${vehicleMake}
      Vehicle Model: ${vehicleModel}
      Selected Services: ${selectedJobs}
      Additional Info: ${additionalInfo}
    `.trim();

    try {
      const res = await axios.post("/api/bookEvent", {
        clientEmail: email,
        clientName: fullName,
        clientPhone: phoneNumber,
        serviceDetails,
      });

      if (res.status === 200) {
        toast.success("Booking successful! We'll contact you soon.");
        closeModal();
      }
    } catch (error) {
      console.error("Error booking the event:", error);
      toast.error("Failed to confirm booking. Please try again later.");
    }
  };

  return (
    <Dialog.Root open onOpenChange={closeModal}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[90vh] w-[90vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-lg z-50 overflow-y-auto">
          <Dialog.Title className="text-xl font-bold mb4">Book a Service</Dialog.Title>

          {/* Full Name */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Full Name*</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border p-2 rounded-md" />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          </div>

          {/* Phone Number */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Phone Number*</label>
            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full border p-2 rounded-md" />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
          </div>

          {/* Email */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Email*</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded-md" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Vehicle Make Dropdown */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Vehicle Make*</label>
            <select value={vehicleMake} onChange={(e) => setVehicleMake(e.target.value)} className="w-full border p-2 rounded-md">
              <option value="">Select Make</option>
              {makes.map((make) => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
            {errors.vehicleMake && <p className="text-red-500 text-sm">{errors.vehicleMake}</p>}
          </div>

          {/* Vehicle Model Dropdown */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Vehicle Model*</label>
            <select value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} className="w-full border p-2 rounded-md" disabled={!vehicleMake}>
              <option value="">Select Model</option>
              {models.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
            {errors.vehicleModel && <p className="text-red-500 text-sm">{errors.vehicleModel}</p>}
          </div>

          {/* Vehicle Year Dropdown */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Vehicle Year*</label>
            <select value={vehicleYear} onChange={(e) => setVehicleYear(e.target.value)} className="w-full border p-2 rounded-md" disabled={!vehicleModel}>
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {errors.vehicleYear && <p className="text-red-500 text-sm">{errors.vehicleYear}</p>}
          </div>

          {/* Job Selection */}
          <h3 className="text-lg font-semibold mt-6">Select Services*</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {Object.keys(jobs).map((jobKey) => (
              <div key={jobKey} className="flex items-center space-x-2">
                <input type="checkbox" id={jobKey} checked={jobs[jobKey as keyof typeof jobs]} onChange={() => handleJobChange(jobKey as keyof typeof jobs)} />
                <label htmlFor={jobKey} className="font-semibold">{jobKey.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</label>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Additional Info</label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="w-full border p-2 rounded-md"
              rows={3}
              placeholder="Enter any other concerns or requests..."
            />
          </div>

          {errors.jobs && <p className="text-red-500 text-sm mt-1">{errors.jobs}</p>}
          <button onClick={handleBooking} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md w-full">
            Book Now
          </button>

        </Dialog.Content>
      </Dialog.Portal>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover />
    </Dialog.Root>
  );
};

export default CustomModal;
