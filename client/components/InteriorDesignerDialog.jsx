import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "./ui/dialog";
import { Button } from "./ui/button";
import { API_CONFIG } from "../config/api";

export function InteriorDesignerDialog({ open, onOpenChange }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        firm: "",
        city: "",
        contact: "",
        email: "",
        projectType: "",
        message: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
        if (error) setError(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const payload = {
            name: form.name,
            firm_name: form.firm,
            city: form.city,
            contact_number: form.contact,
            email: form.email,
            project_type: form.projectType,
            message: form.message,
            partner_type: 'INTERIOR_DESIGNER'
        };

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PARTNER}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Submission failed');

            // Success - Close dialog and redirect to thank you page
            console.log('Interior Designer form submitted', data);
            onOpenChange(false);
            
            navigate('/thank-you', {
                state: {
                    title: "Thank you — we received your Interior Designer request.",
                    message: "Our team will contact you shortly.",
                    buttonText: "Submit Another Request",
                    returnUrl: "/"
                }
            });

            // Reset form
            setForm({
                name: "", firm: "", city: "", contact: "", email: "", projectType: "", message: "",
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Interior Designer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {error && <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded text-sm">{error}</div>}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label className="flex flex-col">
                                    <span className="text-sm text-gray-700">Name</span>
                                    <input name="name" value={form.name} onChange={handleChange} required disabled={isLoading} className="mt-1 block w-full rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                                </label>
                                <label className="flex flex-col">
                                    <span className="text-sm text-gray-700">Firm Name</span>
                                    <input name="firm" value={form.firm} onChange={handleChange} required disabled={isLoading} className="mt-1 block w-full rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                                </label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label className="flex flex-col">
                                    <span className="text-sm text-gray-700">City</span>
                                    <input name="city" value={form.city} onChange={handleChange} required disabled={isLoading} className="mt-1 block w-full rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                                </label>
                                <label className="flex flex-col">
                                    <span className="text-sm text-gray-700">Contact Number</span>
                                    <input name="contact" value={form.contact} onChange={handleChange} required disabled={isLoading} className="mt-1 block w-full rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                                </label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label className="flex flex-col">
                                    <span className="text-sm text-gray-700">Email</span>
                                    <input name="email" type="email" value={form.email} onChange={handleChange} required disabled={isLoading} className="mt-1 block w-full rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                                </label>
                                <label className="flex flex-col">
                                    <span className="text-sm text-gray-700">Project Type</span>
                                    <select name="projectType" value={form.projectType} onChange={handleChange} required disabled={isLoading} className="mt-1 block w-full rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50">
                                        <option value="">Select...</option>
                                        <option>Residential</option>
                                        <option>Commercial</option>
                                        <option>Retail</option>
                                        <option>Hospitality</option>
                                    </select>
                                </label>
                            </div>

                            <label className="flex flex-col">
                                <span className="text-sm text-gray-700">Message</span>
                                <textarea name="message" value={form.message} onChange={handleChange} rows={4} required disabled={isLoading} className="mt-1 block w-full rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                            </label>

                            <div className="flex items-center justify-end gap-3">
                                <DialogClose asChild>
                                    <Button variant="outline" disabled={isLoading}>Close</Button>
                                </DialogClose>
                                <Button type="submit" disabled={isLoading} className="bg-primary text-white disabled:opacity-70">
                                    {isLoading ? "Sending..." : "Send Request"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            );
        }
