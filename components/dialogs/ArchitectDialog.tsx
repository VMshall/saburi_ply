"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ArchitectDialog({ open, onOpenChange }) {
    const [archForm, setArchForm] = useState({
        name: "",
        firm: "",
        location: "",
        contact: "",
        email: "",
        currentProjects: "",
        message: "",
    });
    const [archSubmitted, setArchSubmitted] = useState(false);
    const [archLoading, setArchLoading] = useState(false);
    const [archError, setArchError] = useState(null);

    function handleArchChange(e) {
        const { name, value } = e.target;
        setArchForm((s) => ({ ...s, [name]: value }));
        if (archError) setArchError(null);
    }

    async function handleArchSubmit(e) {
        e.preventDefault();
        setArchLoading(true);
        setArchError(null);

        const payload = {
            name: archForm.name,
            firm_name: archForm.firm,
            city: archForm.location,
            contact_number: archForm.contact,
            email: archForm.email,
            project_type: archForm.currentProjects,
            message: archForm.message,
            partner_type: 'ARCHITECT'
        };

        try {
            const response = await fetch("/api/forms/become-partner", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Submission failed');

            setArchSubmitted(true);
            setArchForm({
                name: "", firm: "", location: "", contact: "", email: "", currentProjects: "", message: "",
            });
        } catch (err) {
            setArchError(err.message);
        } finally {
            setArchLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Architect</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleArchSubmit} className="mt-4 space-y-4">
                    {archSubmitted ? (
                        <div className="rounded-md bg-green-50 border border-green-100 p-4 text-green-800">
                            Thank you — we received your request. Our team will contact you shortly.
                            <Button variant="link" onClick={() => setArchSubmitted(false)} className="block mt-2 h-auto p-0 text-green-700 font-semibold">Submit another request</Button>
                        </div>
                    ) : (
                        <>
                            {archError && <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded text-sm">{archError}</div>}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label className="flex flex-col">
                                    <span className="text-sm text-gray-700">Name</span>
                                    <input name="name" value={archForm.name} onChange={handleArchChange} required disabled={archLoading} className="mt-1 block w-full rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                                </label>
                                <label className="flex flex-col">
                                    <span className="text-sm text-gray-700">Firm Name</span>
                                    <input name="firm" value={archForm.firm} onChange={handleArchChange} required disabled={archLoading} className="mt-1 block w-full rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                                </label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label className="flex flex-col">
                                    <span className="text-sm text-gray-700">Location</span>
                                    <input name="location" value={archForm.location} onChange={handleArchChange} required disabled={archLoading} className="mt-1 block w-full rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                                </label>
                                <label className="flex flex-col">
                                    <span className="text-sm text-gray-700">Contact Number</span>
                                    <input name="contact" value={archForm.contact} onChange={handleArchChange} required disabled={archLoading} className="mt-1 block w-full rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                                </label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label className="flex flex-col">
                                    <span className="text-sm text-gray-700">Email</span>
                                    <input name="email" type="email" value={archForm.email} onChange={handleArchChange} required disabled={archLoading} className="mt-1 block w-full rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                                </label>
                                <label className="flex flex-col">
                                    <span className="text-sm text-gray-700">Current Projects</span>
                                    <input name="currentProjects" value={archForm.currentProjects} onChange={handleArchChange} required disabled={archLoading} className="mt-1 block w-full rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                                </label>
                            </div>

                            <label className="flex flex-col">
                                <span className="text-sm text-gray-700">Message</span>
                                <textarea name="message" value={archForm.message} onChange={handleArchChange} rows={4} required disabled={archLoading} className="mt-1 block w-full rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50" />
                            </label>

                            <div className="flex items-center justify-end gap-3">
                                <DialogClose asChild>
                                    <Button variant="outline" disabled={archLoading}>Close</Button>
                                </DialogClose>
                                <Button type="submit" disabled={archLoading} className="bg-primary text-white disabled:opacity-70">
                                    {archLoading ? "Sending..." : "Send Request"}
                                </Button>
                            </div>
                        </>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
