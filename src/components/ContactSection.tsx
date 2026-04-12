import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Mail,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useMessages } from "../i18n";

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactSection() {
  const messages = useMessages();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = messages.contact.errors.nameRequired;
    }

    if (!formData.email.trim()) {
      newErrors.email = messages.contact.errors.emailRequired;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = messages.contact.errors.emailInvalid;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = messages.contact.errors.subjectRequired;
    }

    if (!formData.message.trim()) {
      newErrors.message = messages.contact.errors.messageRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(messages.contact.toasts.fixErrorsTitle, {
        description: messages.contact.toasts.fixErrorsDescription,
      });
      return;
    }

    setStatus("sending");

    const subject = encodeURIComponent(formData.subject.trim());
    const body = encodeURIComponent(
      `Name: ${formData.name.trim()}\nEmail: ${formData.email.trim()}\n\n${formData.message.trim()}`,
    );

    window.location.href = `mailto:jiliangy@chalmers.se?subject=${subject}&body=${body}`;

    setStatus("success");
    toast.success(messages.contact.toasts.openedTitle, {
      description: messages.contact.toasts.openedDescription,
    });

    setTimeout(() => {
      setStatus("idle");
    }, 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="min-h-screen px-8 py-20 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-teal-100/50 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-800 mb-6">
            {messages.contact.title}
          </h2>
          <div className="h-1 w-20 bg-teal-400 mx-auto rounded-full mb-8" />

          <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed font-light">
            {messages.contact.intro}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide"
                >
                  {messages.contact.labels.name}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={messages.contact.placeholders.name}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all placeholder:text-slate-400"
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide"
                >
                  {messages.contact.labels.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={messages.contact.placeholders.email}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all placeholder:text-slate-400"
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide"
                >
                  {messages.contact.labels.subject}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={messages.contact.placeholders.subject}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all placeholder:text-slate-400"
                />
                {errors.subject && <p className="text-sm text-red-500 mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide"
                >
                  {messages.contact.labels.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder={messages.contact.placeholders.message}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all resize-none placeholder:text-slate-400"
                />
                {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={status === "sending"}
                whileHover={{ scale: status === "sending" ? 1 : 1.02 }}
                whileTap={{ scale: status === "sending" ? 1 : 0.98 }}
                className={`flex min-h-[60px] w-full items-center justify-center gap-2 rounded-xl py-4 font-bold text-slate-900 shadow-lg transition-all ${
                  status === "error" ? "bg-red-400 hover:bg-red-500" : "bg-teal-400 hover:bg-teal-500"
                }`}
                style={{
                  opacity: status === "sending" ? 0.7 : 1,
                  cursor: status === "sending" ? "not-allowed" : "pointer",
                }}
              >
                {status === "idle" && (
                  <>
                    <Send className="w-5 h-5" />
                    {messages.contact.buttons.openDraft}
                  </>
                )}
                {status === "sending" && (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Send className="w-5 h-5" />
                    </motion.div>
                    {messages.contact.buttons.opening}
                  </>
                )}
                {status === "success" && (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {messages.contact.buttons.draftReady}
                  </>
                )}
                {status === "error" && (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    {messages.contact.buttons.failed}
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="space-y-8 lg:pt-8"
          >
            <div className="grid gap-6">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 flex items-start gap-5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-500 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">
                    {messages.contact.labels.emailCard}
                  </h4>
                  <a
                    href="mailto:jiliangy@chalmers.se"
                    className="text-slate-600 hover:text-teal-600 transition-colors"
                  >
                    jiliangy@chalmers.se
                  </a>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    {messages.contact.meta.responseTime}
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 flex items-start gap-5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">
                    {messages.contact.labels.location}
                  </h4>
                  <p className="text-slate-600">{messages.contact.meta.locationValue}</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    {messages.contact.meta.locationAvailability}
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl group-hover:bg-teal-500/30 transition-all duration-500" />

              <h4 className="text-xl font-bold mb-4 relative z-10">
                {messages.contact.labels.availability}
              </h4>
              <div className="flex items-center gap-3 mb-6 bg-slate-700/50 w-fit px-4 py-2 rounded-full border border-slate-600">
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-teal-400"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(45, 212, 191, 0)",
                      "0 0 0 4px rgba(45, 212, 191, 0.2)",
                      "0 0 0 0 rgba(45, 212, 191, 0)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="text-sm font-medium text-teal-300">
                  {messages.contact.meta.availableForNewProjects}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed font-light relative z-10">
                {messages.contact.meta.availabilityBody}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
