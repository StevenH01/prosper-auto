import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface TimeSlot {
  start: string;
  end: string;
}

type ServiceKey = 'ppf' | 'windowTint' | 'ceramicCoating' | 'vinylWrap';

interface CustomModalProps {
  closeModal: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ closeModal }) => {
  // Form fields state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Error state for each field
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    services: ''
  });

  // State to track selected services
  const [services, setServices] = useState({
    ppf: false,
    windowTint: false,
    ceramicCoating: false,
    vinylWrap: false,
  });

  // Handle checkbox change with specific type
  const handleServiceChange = (service: ServiceKey) => {
    setServices((prev) => ({
      ...prev,
      [service]: !prev[service],
    }));
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {
      firstName: firstName ? '' : 'First name is required.',
      lastName: lastName ? '' : 'Last name is required.',
      phoneNumber: phoneNumber ? '' : 'Phone number is required.',
      email: email ? '' : 'Email is required.',
      vehicleYear: vehicleYear ? '' : 'Vehicle year is required.',
      vehicleMake: vehicleMake ? '' : 'Vehicle make is required.',
      vehicleModel: vehicleModel ? '' : 'Vehicle model is required.',
      services: Object.values(services).some((selected) => selected)
        ? ''
        : 'Please select one of the following services.'
    };
    setErrors(newErrors);

    // Check if there are any errors
    return Object.values(newErrors).every((error) => error === '');
  };

  const handleBooking = async () => {
    if (!validateForm()) return;

    const eventDetails = {
      summary: 'Service Booking',
      description: `Booking for a service by ${firstName} ${lastName}`,
      start: { dateTime: new Date().toISOString() },
      end: { dateTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString() },
    };

    const selectedServices = Object.entries(services)
    .filter(([_, isSelected]) => isSelected)
    .map(([service]) => service.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()))
    .join(', ');

    try {
      // Send the booking data to the backend
      const res = await axios.post('/api/bookEvent', eventDetails);
      if (res.status === 200) {
        toast.success('Thank you! Someone will reach out to you as soon as possible with a quote.');

        // Send notifications (SMS to owner and email to client)
        await axios.post('/api/sendNotifications', {
          clientEmail: email,
          clientName: `${firstName} ${lastName}`,
          clientPhone: phoneNumber,
          serviceDetails: `Vehicle Year: ${vehicleYear} \nMake: ${vehicleMake} \nModel: ${vehicleModel} \nAdditional Info: ${additionalInfo} \nSelected Services: ${selectedServices}`,
          ownerEmail: 'steven09ho@gmail.com', // Replace with the actual owner email
          ownerPhone: '+19167098025', // Replace with the owner's phone number
        });
        closeModal();
      }
    } catch (error) {
      console.error('Error booking the event:', error);
      toast.error('Failed to confirm booking. Please try again later.');
    }
  };

  return (
    <Dialog.Root open onOpenChange={closeModal}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-40" />

        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[90vh] w-[90vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-lg z-50 overflow-y-auto">
          <Dialog.Title className="text-xl font-bold mb-4">Let&apos;s get started!</Dialog.Title>
          <Dialog.Description className="mb-6 text-sm text-gray-600">
            Fill out the form below, or contact us directly at:
          </Dialog.Description>

          {/* Contact Details */}
          <h3 className="text-lg font-semibold">Step 1: Contact Details</h3>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="flex flex-col">
              <label className="font-semibold">First Name*</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border rounded px-3 py-2"
                placeholder="Enter your first name"
              />
              {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Last Name*</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border rounded px-3 py-2"
                placeholder="Enter your last name"
              />
              {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Mobile Phone Number*</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border rounded px-3 py-2"
                placeholder="Enter your phone number"
              />
              {errors.phoneNumber && <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Email Address*</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded px-3 py-2"
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Vehicle Information */}
          <h3 className="text-lg font-semibold mt-6">Step 2: Vehicle Information</h3>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="flex flex-col">
              <label className="font-semibold">Vehicle Year*</label>
              <input
                type="text"
                value={vehicleYear}
                onChange={(e) => setVehicleYear(e.target.value)}
                className="border rounded px-3 py-2"
                placeholder="e.g., 2017"
              />
              {errors.vehicleYear && <p className="text-red-600 text-sm mt-1">{errors.vehicleYear}</p>}
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Vehicle Make*</label>
              <input
                type="text"
                value={vehicleMake}
                onChange={(e) => setVehicleMake(e.target.value)}
                className="border rounded px-3 py-2"
                placeholder="e.g., Tesla"
              />
              {errors.vehicleMake && <p className="text-red-600 text-sm mt-1">{errors.vehicleMake}</p>}
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Vehicle Model*</label>
              <input
                type="text"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                className="border rounded px-3 py-2"
                placeholder="e.g., Model S"
              />
              {errors.vehicleModel && <p className="text-red-600 text-sm mt-1">{errors.vehicleModel}</p>}
            </div>
          </div>

          {/* Services Section */}
          <h3 className="text-lg font-semibold mt-6">Step 3: Select Services</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ppf"
                checked={services.ppf}
                onChange={() => handleServiceChange("ppf")}
              />
              <label htmlFor="ppf" className="font-semibold">Paint Protection Film</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="window-tint"
                checked={services.windowTint}
                onChange={() => handleServiceChange("windowTint")}
              />
              <label htmlFor="window-tint" className="font-semibold">Window Tint</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ceramic-coating"
                checked={services.ceramicCoating}
                onChange={() => handleServiceChange("ceramicCoating")}
              />
              <label htmlFor="ceramic-coating" className="font-semibold">Ceramic Coating</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="vinyl-wrap"
                checked={services.vinylWrap}
                onChange={() => handleServiceChange("vinylWrap")}
              />
              <label htmlFor="vinyl-wrap" className="font-semibold">Vehicle Vinyl Wrap</label>
            </div>
          </div>
          {errors.services && <p className="text-red-600 text-sm mt-1">{errors.services}</p>}

          {/* Additional Information */}
          <div className="mt-6">
            <label className="font-semibold">Additional Information</label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="border rounded px-3 py-2 w-full mt-2"
              rows={4}
              placeholder="Tell us more about your car's history or special requests"
            ></textarea>
          </div>

          <button
            onClick={handleBooking}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md w-full"
          >
            Send Service Request
          </button>

          <Dialog.Close asChild>
            <button onClick={closeModal} className="absolute top-2 right-2 text-black">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
      {/* Toast Container to display notifications */}
      <ToastContainer 
        position="top-center" // Change position to top-center
        autoClose={5000} 
        hideProgressBar={false} 
        closeOnClick 
        pauseOnHover 
      />
    </Dialog.Root>
  );
};

export default CustomModal;
