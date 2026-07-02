import React, { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  ArrowLeft, 
  Loader2, 
  Send, 
  Cpu, 
  FileText, 
  GraduationCap, 
  Mail, 
  User 
} from 'lucide-react';
import { submitAccessRequest, getRequestByEmail } from '../services/accessRequestService';

interface AccessRequestProps {
  onReturn: () => void;
}

interface FormState {
  name: string;
  email: string;
  university: string;
  purpose: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  university?: string;
  purpose?: string;
}

export default function AccessRequest({ onReturn }: AccessRequestProps) {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    university: '',
    purpose: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Handle Input Changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear inline error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Client-Side Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedUniversity = formData.university.trim();
    const trimmedPurpose = formData.purpose.trim();

    if (!trimmedName) {
      newErrors.name = 'Full name is required.';
    }

    if (!trimmedEmail) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!trimmedUniversity) {
      newErrors.university = 'University or Company is required.';
    }

    if (!trimmedPurpose) {
      newErrors.purpose = 'Purpose of access is required.';
    } else if (trimmedPurpose.length < 20) {
      newErrors.purpose = `Purpose must be at least 20 characters (currently ${trimmedPurpose.length} chars).`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const email = formData.email.trim();
      const name = formData.name.trim();
      const university = formData.university.trim();
      const purpose = formData.purpose.trim();

      // Check for duplicate pending requests
      const existingRequest = await getRequestByEmail(email);
      if (existingRequest && existingRequest.status === 'pending') {
        setSubmitError('You already have a pending request.');
        setIsSubmitting(false);
        return;
      }

      // Submit new access request
      await submitAccessRequest({
        name,
        email,
        university,
        purpose,
      });

      setIsSuccess(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred during submission.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 flex justify-center items-center px-4 sm:px-6 lg:px-8" id="access-request-container">
      <div className="w-full max-w-xl">
        
        {/* Back Link */}
        <button
          onClick={onReturn}
          className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-slate-400 hover:text-white transition-all cursor-pointer"
          id="access-request-back-btn"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Return to Portfolio
        </button>

        {!isSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            id="access-request-card"
          >
            {/* Ambient subtle glow effect */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#a78bfa] via-[#c084fc] to-[#e879f9]" />

            {/* Header */}
            <div className="mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1a1a] text-[#a78bfa] mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h1 className="font-mono text-2xl font-extrabold tracking-tight text-white uppercase" id="access-request-title">
                Request Project Access
              </h1>
              <p className="mt-2.5 font-sans text-xs text-slate-400 leading-relaxed" id="access-request-subtitle">
                Some ASIC, RTL, FPGA and research resources are available only upon approval. Submit a request below.
              </p>
            </div>

            {/* Inline General Submission Error */}
            {submitError && (
              <div 
                className="mb-6 rounded-lg border border-red-500/20 bg-red-500/5 p-4 flex items-start gap-3 font-sans text-xs text-red-400 animate-in fade-in"
                id="access-request-error-alert"
              >
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-red-500" />
                <div>
                  <span className="font-bold block uppercase font-mono tracking-wider text-[10px] mb-0.5">Operation Aborted</span>
                  <span>{submitError}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block font-mono text-[10px] uppercase font-bold tracking-wider text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="Enter your first and last name"
                    className={`w-full bg-[#0a0a0c] border rounded-lg pl-10 pr-4 py-2.5 font-sans text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                      errors.name 
                        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-[rgba(255,255,255,0.08)] focus:border-[#a78bfa]/50 focus:ring-[#a78bfa]/20'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 font-mono text-[9px] text-red-400 font-bold uppercase">{errors.name}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block font-mono text-[10px] uppercase font-bold tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="you@domain.com"
                    className={`w-full bg-[#0a0a0c] border rounded-lg pl-10 pr-4 py-2.5 font-sans text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                      errors.email 
                        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-[rgba(255,255,255,0.08)] focus:border-[#a78bfa]/50 focus:ring-[#a78bfa]/20'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 font-mono text-[9px] text-red-400 font-bold uppercase">{errors.email}</p>
                )}
              </div>

              {/* University / Company */}
              <div>
                <label htmlFor="university" className="block font-mono text-[10px] uppercase font-bold tracking-wider text-slate-300 mb-1.5">
                  University / Company
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    id="university"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="e.g. Stanford University or Intel Corp"
                    className={`w-full bg-[#0a0a0c] border rounded-lg pl-10 pr-4 py-2.5 font-sans text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                      errors.university 
                        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-[rgba(255,255,255,0.08)] focus:border-[#a78bfa]/50 focus:ring-[#a78bfa]/20'
                    }`}
                  />
                </div>
                {errors.university && (
                  <p className="mt-1.5 font-mono text-[9px] text-red-400 font-bold uppercase">{errors.university}</p>
                )}
              </div>

              {/* Purpose of Access */}
              <div>
                <label htmlFor="purpose" className="block font-mono text-[10px] uppercase font-bold tracking-wider text-slate-300 mb-1.5">
                  Purpose of Access
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <textarea
                    id="purpose"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    rows={4}
                    placeholder="Describe how you plan to use the digital cores, RTL resources, or academic layouts (minimum 20 characters)..."
                    className={`w-full bg-[#0a0a0c] border rounded-lg pl-10 pr-4 py-2.5 font-sans text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all resize-none ${
                      errors.purpose 
                        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-[rgba(255,255,255,0.08)] focus:border-[#a78bfa]/50 focus:ring-[#a78bfa]/20'
                    }`}
                  />
                </div>
                {errors.purpose && (
                  <p className="mt-1.5 font-mono text-[9px] text-red-400 font-bold uppercase">{errors.purpose}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 flex items-center justify-center gap-2 rounded-lg bg-[#a78bfa] disabled:bg-[#a78bfa]/40 disabled:cursor-not-allowed px-4 py-3 font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#0a0a0a] hover:bg-[#b49dfb] active:scale-98 transition-all shadow-lg shadow-[#a78bfa]/10 duration-200 cursor-pointer"
                id="access-request-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Transmitting Request...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" /> Submit Request
                  </>
                )}
              </button>

            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] p-8 text-center shadow-2xl relative overflow-hidden"
            id="access-request-success-panel"
          >
            {/* Ambient subtle glow effect */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-teal-400" />

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto mb-5">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <h1 className="font-mono text-2xl font-extrabold text-white tracking-tight uppercase" id="access-request-success-title">
              Request Submitted
            </h1>
            
            <p className="mt-4 font-sans text-sm text-slate-300 leading-relaxed max-w-sm mx-auto" id="access-request-success-msg">
              Your request has been received successfully.
              <br />
              Once approved, a secure download link will be emailed to you.
            </p>

            <button
              onClick={onReturn}
              className="mt-8 inline-flex items-center gap-2 rounded-lg border-2 border-[#a78bfa]/80 bg-transparent px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#a78bfa] hover:bg-[#a78bfa]/10 active:scale-95 transition-all duration-200 cursor-pointer"
              id="access-request-return-btn"
            >
              Return to Portfolio
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
