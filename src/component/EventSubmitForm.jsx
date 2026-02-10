import React, { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Clock,
  MapPin,
  Calendar,
  User,
  Mail,
  Building,
  FileText,
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  Globe,
  Twitter,
  Linkedin,
  Instagram,
  Image,
  Users,
  Heart,
  Award,
  Target,
  Zap
} from 'lucide-react';

const EventSubmitForm = ({ animations, User }) => {
    const [newEvent, setNewEvent] = useState({
        name: "",
        email: "",
        organization: "",
        title: "",
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
        location: "",
        website_url: "",
        registration_link: "",
        external_links: "",
        type: "festival",
        description: "",
        featured_image: null, // file
        is_all_day: false,
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [submittedEvents, setSubmittedEvents] = useState([]);
      const addEvent = async () => {
        setSubmitError("");
        setSubmitSuccess("");
        if (!validateEvent()) return;
    
        try {
          setIsSubmitting(true);
          const formData = new FormData();
          formData.append("name", newEvent.name.trim());
          formData.append("title", newEvent.title.trim());
          formData.append("start_date", newEvent.start_date);
          formData.append("end_date", newEvent.end_date);
          formData.append(
            "start_time",
            newEvent.start_date && newEvent.start_time
              ? `${newEvent.start_date} ${newEvent.start_time}`
              : ""
          );
          formData.append(
            "end_time",
            newEvent.end_date && newEvent.end_time
              ? `${newEvent.end_date} ${newEvent.end_time}`
              : ""
          );
          formData.append("contact_email", newEvent.email.trim());
          formData.append("organization", newEvent.organization);
          formData.append("location", newEvent.location);
          formData.append("website_url", newEvent.website_url);
          formData.append("registration_link", newEvent.registration_link);
          formData.append("external_links", newEvent.external_links);
          formData.append("type", newEvent.type);
          formData.append("description", newEvent.description);
          formData.append("is_all_day", newEvent.is_all_day ? "1" : "0");
          formData.append("organizer_name", newEvent.organization || newEvent.name);
    
          // handle file if provided
          if (newEvent.featured_image) {
            formData.append("eventImg", newEvent.featured_image);
          }
    
          const url = `${config.apiBaseUrl}/events`;
    
          const response = await fetch(url, {
            method: "POST",
            body: formData,
          });
    
          const result = await response.json();
          console.log("Event added:", result);
    
          if (response.ok) {
            const eventWithId = {
              ...newEvent,
              id: result?.id || Date.now(),
              organizer: newEvent.organization || newEvent.name,
            };
    
            const dateKey = newEvent.start_date;
            setEvents(prev => ({
              ...prev,
              [dateKey]: [...(prev[dateKey] || []), eventWithId],
            }));
    
            setSubmittedEvents(prev => [...prev, eventWithId]);
    
            setNewEvent({
              name: "",
              email: "",
              organization: "",
              title: "",
              start_date: "",
              end_date: "",
              start_time: "",
              end_time: "",
              location: "",
              website_url: "",
              registration_link: "",
              external_links: "",
              type: "festival",
              description: "",
              featured_image: null,
              is_all_day: false,
            });
            setShowCreateModal(false);
            setSubmitSuccess("Event submitted successfully.");
          } else {
            setSubmitError(result?.message || "Failed to add event. Please try again.");
            console.error("Failed to add event:", result);
          }
        } catch (error) {
          setSubmitError("Error adding event. Please try again.");
          console.error("Error adding event:", error);
        } finally {
          setIsSubmitting(false);
        }
      };
    

      
    return (
        <div>
            {/* Event Submission Form */}
            <div id="event-form" className={`mt-20 transition-all duration-1000 delay-700 ${animations.formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-red-900/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-yellow-300/20">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-yellow-100 mb-4 flex items-center justify-center gap-3">
                            🕉️ Submit Sacred Event
                        </h2>
                        <p className="text-yellow-100/70 text-lg max-w-2xl mx-auto">
                            Share your spiritual event with our divine community. Include festivals, celebrations,
                            and sacred gatherings to help others connect with Hindu traditions.
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    value={newEvent.name}
                                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                                    className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={newEvent.email}
                                    onChange={(e) => setNewEvent({ ...newEvent, email: e.target.value })}
                                    className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                                    <Building className="w-4 h-4" />
                                    Organization/Temple
                                </label>
                                <input
                                    type="text"
                                    value={newEvent.organization}
                                    onChange={(e) => setNewEvent({ ...newEvent, organization: e.target.value })}
                                    className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                                    placeholder="Temple or organization name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Event Start Date *
                                </label>
                                <input
                                    type="date"
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                    className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Event End Date *
                                </label>
                                <input
                                    type="date"
                                    value={newEvent.end_date}
                                    onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
                                    className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                                <Star className="w-4 h-4" />
                                Event Title *
                            </label>
                            <input
                                type="text"
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                                placeholder="Enter your sacred event title"
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Start Time
                                </label>
                                <input
                                    type="time"
                                    value={newEvent.start_time}
                                    onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
                                    className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    End Time
                                </label>
                                <input
                                    type="time"
                                    value={newEvent.end_time}
                                    onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
                                    className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={newEvent.location}
                                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                    className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                                    placeholder="Temple or venue"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                                    {/* <Link className="w-4 h-4" /> */}
                                    Website URL
                                </label>
                                <input
                                    type="url"
                                    value={newEvent.website_url}
                                    onChange={(e) => setNewEvent({ ...newEvent, website_url: e.target.value })}
                                    className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                                    {/* <Link className="w-4 h-4" /> */}
                                    Registration Link
                                </label>
                                <input
                                    type="url"
                                    value={newEvent.registration_link}
                                    onChange={(e) => setNewEvent({ ...newEvent, registration_link: e.target.value })}
                                    className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                                    placeholder="https://example.com/register"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                External Links
                            </label>
                            <textarea
                                value={newEvent.external_links}
                                onChange={(e) => setNewEvent({ ...newEvent, external_links: e.target.value })}
                                rows="2"
                                className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30 resize-none"
                                placeholder="Add any other relevant links, one per line."
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-yellow-100 font-semibold mb-2">Event Type</label>
                            <select
                                value={newEvent.type}
                                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                                className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                            >
                                <option value="festival" className="bg-red-800">Festival/Religious</option>
                                <option value="cultural" className="bg-red-800">Cultural Event</option>
                                <option value="personal" className="bg-red-800">Personal Celebration</option>
                                <option value="work" className="bg-red-800">Community Service</option>
                                <option value="meeting" className="bg-red-800">Spiritual Gathering</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                                <Image className="w-4 h-4" />
                                Event Image  (Optional)
                            </label>
                            <input
                                type="file"
                                value={newEvent.featured_image}
                                onChange={(e) => setNewEvent({ ...newEvent, featured_image: e.target.value })}
                                className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="mb-8">
                            <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Event Description
                            </label>
                            <textarea
                                value={newEvent.description}
                                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                rows="4"
                                className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30 resize-none"
                                placeholder="Describe your sacred event, its significance, and what participants can expect..."
                            />
                        </div>

                        <div className="mb-8 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_all_day"
                                checked={newEvent.is_all_day}
                                onChange={(e) => setNewEvent({ ...newEvent, is_all_day: e.target.checked })}
                                className="form-checkbox h-5 w-5 text-yellow-500 bg-red-900/20 border-yellow-300/30 rounded-md focus:ring-yellow-500"
                            />
                            <label htmlFor="is_all_day" className="text-yellow-100 font-semibold">
                                All Day Event?
                            </label>
                        </div>

                        <button
                            onClick={addEvent}
                            className="w-full bg-gradient-to-r from-yellow-500 to-red-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                        >
                            <CheckCircle className="w-6 h-6" />
                            Submit Sacred Event
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventSubmitForm