import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface TimeSlot {
  start: string;
  end: string;
}

interface CustomModalProps {
  closeModal: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ closeModal }) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    // Fetch available time slots
    const fetchSlots = async () => {
      const res = await axios.get('/api/getAvailableSlots', {
        params: {
          timeMin: new Date().toISOString(),
          timeMax: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // Next 7 days
        },
      });
      setTimeSlots(res.data);
    };

    fetchSlots();
  }, []);

  const handleBooking = async () => {
    if (!selectedSlot) return;

    const eventDetails = {
      summary: 'Service Booking',
      start: { dateTime: selectedSlot.start }, // No error here
      end: { dateTime: selectedSlot.end },     // No error here
      description: 'Booking for a service',
    };

    try {
      const res = await axios.post('/api/bookEvent', eventDetails);
      if (res.status === 200) {
        alert('Booking confirmed!');
      }
    } catch (error) {
      console.error("Error booking the event:", error);
      alert('Failed to confirm booking');
    }
  };

  return (
    <Dialog.Root open onOpenChange={closeModal}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-40" />

        {/* Modal Content */}
        <Dialog.Content
          className="fixed top-1/2 left-1/2 max-h-[90vh] w-[90vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-lg z-50 overflow-y-auto"
        >
          <Dialog.Title className="text-xl font-bold mb-4">Let's get started!</Dialog.Title>
          <Dialog.Description className="mb-6 text-sm text-gray-600">
            Fill out the form below, or contact us directly at:
          </Dialog.Description>

          {/* Contact Info */}
          <div className="mb-6">
            <p className="font-semibold text-lg">(949) 432-7977</p>
            <div className="flex space-x-4 mt-4">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md">Call</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Text</button>
            </div>
          </div>

          {/* Form Section */}
          <form>
            <h3 className="text-lg font-semibold">Step 1: Contact Details</h3>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <div className="flex flex-col">
                <label className="font-semibold">First Name*</label>
                <input type="text" className="border rounded px-3 py-2" placeholder="Enter your first name" />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Last Name*</label>
                <input type="text" className="border rounded px-3 py-2" placeholder="Enter your last name" />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Mobile Phone Number*</label>
                <input type="tel" className="border rounded px-3 py-2" placeholder="Enter your phone number" />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Email Address*</label>
                <input type="email" className="border rounded px-3 py-2" placeholder="Enter your email address" />
              </div>
            </div>

            {/* Vehicle Information */}
            <h3 className="text-lg font-semibold mt-6">Step 2: Vehicle Information</h3>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <div className="flex flex-col">
                <label className="font-semibold">Vehicle Year*</label>
                <input type="text" className="border rounded px-3 py-2" placeholder="e.g., 2017" />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Vehicle Make*</label>
                <input type="text" className="border rounded px-3 py-2" placeholder="e.g., Tesla" />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Vehicle Model*</label>
                <input type="text" className="border rounded px-3 py-2" placeholder="e.g., Model S" />
              </div>
            </div>

            {/* Services Section */}
            <h3 className="text-lg font-semibold mt-6">Step 3: Select Services</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="ppf" />
                <label htmlFor="ppf" className="font-semibold">Paint Protection Film</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="window-tint" />
                <label htmlFor="window-tint" className="font-semibold">Window Tint</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="ceramic-coating" />
                <label htmlFor="ceramic-coating" className="font-semibold">Ceramic Coating</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="vinyl-wrap" />
                <label htmlFor="vinyl-wrap" className="font-semibold">Vehicle Vinyl Wrap</label>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-6">
              <label className="font-semibold">Additional Information</label>
              <textarea
                className="border rounded px-3 py-2 w-full mt-2"
                rows={4}
                placeholder="Tell us more about your car's history or special requests"
              ></textarea>
            </div>

            <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md w-full">Send Service Request</button>
          </form>

          <div>
            <h3 className="text-lg font-semibold mt-6">Step 4: Choose a Time Slot</h3>
            <div className="grid grid-cols-1 gap-4 mt-4">
              {timeSlots.length > 0 ? (
                timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <input
                      type="radio"
                      name="timeSlot"
                      value={index}
                      onChange={() => setSelectedSlot(slot)} // Setting selected slot
                    />
                    <label>{new Date(slot.start).toLocaleString()}</label>
                  </div>
                ))
              ) : (
                <p>No available slots</p>
              )}
            </div>
            <button
              onClick={handleBooking}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md w-full"
              disabled={!selectedSlot} // Disable button if no slot is selected
            >
              Confirm Booking
            </button>
          </div>

          {/* Close Button */}
          <Dialog.Close asChild>
            <button
              onClick={closeModal} // Close the modal
              className="absolute top-2 right-2 text-black"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CustomModal;
