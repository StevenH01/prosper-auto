"use client"
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ weight: '800', subsets: ['latin'] });

type ServiceKey = 'ppf' | 'windowTint' | 'ceramicCoating' | 'vinylWrap';

const SERVICE_LABELS: Record<ServiceKey, string> = {
  ppf: 'Paint Protection Film',
  windowTint: 'Window Tint',
  ceramicCoating: 'Ceramic Coating',
  vinylWrap: 'Vinyl Wrap',
};

interface FormState {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  additionalInfo: string;
}

interface FormErrors extends Omit<FormState, 'additionalInfo'> {
  services: string;
}

interface CustomModalProps {
  closeModal: () => void;
}

const inputClass =
  'bg-[#1a1a1a] border border-[#333] text-white text-sm px-3 py-2.5 w-full placeholder:text-zinc-600 focus:outline-none focus:border-red-600/60 transition-colors';

const StepLabel = ({ number, label }: { number: string; label: string }) => (
  <div className="flex items-center gap-3">
    <span className="text-red-600/30 font-black text-2xl leading-none select-none">{number}</span>
    <span className="text-zinc-400 text-[10px] uppercase tracking-[0.2em] font-bold">{label}</span>
    <div className="flex-1 h-px bg-[#242424]" />
  </div>
);

const Field = ({
  label,
  error,
  children,
  className = '',
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold">{label}</label>
    {children}
    {error && <span className="text-red-500 text-[11px]">{error}</span>}
  </div>
);

const CustomModal: React.FC<CustomModalProps> = ({ closeModal }) => {
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    additionalInfo: '',
  });

  const [errors, setErrors] = useState<Partial<FormErrors>>({});

  const [services, setServices] = useState<Record<ServiceKey, boolean>>({
    ppf: false,
    windowTint: false,
    ceramicCoating: false,
    vinylWrap: false,
  });

  const [loading, setLoading] = useState(false);

  const setField =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const toggleService = (key: ServiceKey) =>
    setServices((prev) => ({ ...prev, [key]: !prev[key] }));

  const validate = (): boolean => {
    const newErrors: Partial<FormErrors> = {};
    if (!form.firstName) newErrors.firstName = 'Required.';
    if (!form.lastName) newErrors.lastName = 'Required.';
    if (!form.phoneNumber) newErrors.phoneNumber = 'Required.';
    if (!form.email) newErrors.email = 'Required.';
    if (!form.vehicleYear) newErrors.vehicleYear = 'Required.';
    if (!form.vehicleMake) newErrors.vehicleMake = 'Required.';
    if (!form.vehicleModel) newErrors.vehicleModel = 'Required.';
    if (!Object.values(services).some(Boolean))
      newErrors.services = 'Select at least one service.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    const selectedServices = (Object.keys(services) as ServiceKey[])
      .filter((k) => services[k])
      .map((k) => SERVICE_LABELS[k])
      .join(', ');

    const serviceDetails = [
      `Vehicle: ${form.vehicleYear} ${form.vehicleMake} ${form.vehicleModel}`,
      `Services: ${selectedServices}`,
      form.additionalInfo ? `Notes: ${form.additionalInfo}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const eventDetails = {
      summary: `Service Booking — ${form.firstName} ${form.lastName}`,
      description: serviceDetails,
      start: { dateTime: new Date().toISOString() },
      end: { dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString() },
    };

    try {
      const res = await axios.post('/api/bookEvent', eventDetails);
      if (res.status === 200) {
        await axios.post('/api/sendNotifications', {
          clientEmail: form.email,
          clientName: `${form.firstName} ${form.lastName}`,
          clientPhone: form.phoneNumber,
          serviceDetails,
          ownerEmail: 'prosperautowerks@gmail.com',
          ownerPhone: '+19168387384',
        });
        toast.success("Request sent! We'll reach out shortly with a quote.");
        setTimeout(closeModal, 3000);
      }
    } catch {
      toast.error('Something went wrong. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog.Root open onOpenChange={closeModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" />

          <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[90vh] w-[92vw] sm:w-[520px] -translate-x-1/2 -translate-y-1/2 bg-[#111111] border border-[#242424] z-50 overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-[#111111] border-b border-[#242424] px-7 py-5 flex items-start justify-between z-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px w-5 bg-red-600" />
                  <span className="text-red-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                    Get a Quote
                  </span>
                </div>
                <Dialog.Title className={`${poppins.className} text-white text-2xl uppercase`}>
                  Book a Service
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button
                  onClick={closeModal}
                  className="text-zinc-500 hover:text-white transition-colors p-1 mt-1"
                  aria-label="Close"
                >
                  <Cross2Icon className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="px-7 py-6 flex flex-col gap-8">
              {/* Step 1 — Contact */}
              <section>
                <StepLabel number="01" label="Contact Details" />
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Field label="First Name" error={errors.firstName}>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={setField('firstName')}
                      placeholder="Jane"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Last Name" error={errors.lastName}>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={setField('lastName')}
                      placeholder="Doe"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Phone Number" error={errors.phoneNumber} className="col-span-2">
                    <input
                      type="tel"
                      value={form.phoneNumber}
                      onChange={setField('phoneNumber')}
                      placeholder="(916) 000-0000"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Email Address" error={errors.email} className="col-span-2">
                    <input
                      type="email"
                      value={form.email}
                      onChange={setField('email')}
                      placeholder="jane@example.com"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </section>

              {/* Step 2 — Vehicle */}
              <section>
                <StepLabel number="02" label="Vehicle Info" />
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <Field label="Year" error={errors.vehicleYear}>
                    <input
                      type="text"
                      value={form.vehicleYear}
                      onChange={setField('vehicleYear')}
                      placeholder="2021"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Make" error={errors.vehicleMake}>
                    <input
                      type="text"
                      value={form.vehicleMake}
                      onChange={setField('vehicleMake')}
                      placeholder="Tesla"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Model" error={errors.vehicleModel}>
                    <input
                      type="text"
                      value={form.vehicleModel}
                      onChange={setField('vehicleModel')}
                      placeholder="Model 3"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </section>

              {/* Step 3 — Services */}
              <section>
                <StepLabel number="03" label="Select Services" />
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {(Object.keys(services) as ServiceKey[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleService(key)}
                      className={`text-left px-4 py-3 border text-xs font-bold uppercase tracking-widest transition-all duration-150 ${
                        services[key]
                          ? 'border-red-600 bg-red-600/10 text-white'
                          : 'border-[#333] text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {services[key] && <span className="text-red-500 mr-1.5">✓</span>}
                      {SERVICE_LABELS[key]}
                    </button>
                  ))}
                </div>
                {errors.services && (
                  <p className="text-red-500 text-[11px] mt-2">{errors.services}</p>
                )}
              </section>

              {/* Additional notes */}
              <section>
                <label className="text-zinc-500 text-[10px] uppercase tracking-[0.25em] font-bold">
                  Additional Notes
                </label>
                <textarea
                  value={form.additionalInfo}
                  onChange={setField('additionalInfo')}
                  rows={3}
                  placeholder="Paint condition, coverage areas, special requests…"
                  className={`${inputClass} mt-2 resize-none`}
                />
              </section>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-[0.2em] py-4 transition-colors duration-200"
              >
                {loading ? 'Sending…' : 'Send Service Request'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <ToastContainer position="top-center" autoClose={4000} hideProgressBar theme="dark" />
    </>
  );
};

export default CustomModal;
